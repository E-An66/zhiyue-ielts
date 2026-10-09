(function (root) {
  "use strict";
  const missing = Symbol("missing");
  const appendOnly = new Set(["studyLog", "expressionLog", "speechReports"]);
  const dangerous = new Set(["__proto__", "constructor", "prototype"]);
  const object = v => v !== null && typeof v === "object" && !Array.isArray(v);
  const clone = value => {
    if (value === missing) return missing;
    if (Array.isArray(value)) return value.map(clone);
    if (object(value) && !(value instanceof Date)) {
      return Object.fromEntries(Object.keys(value).filter(k => !dangerous.has(k)).map(k => [k, clone(value[k])]));
    }
    return structuredClone(value);
  };
  const same = (a, b) => {
    if (a === b) return true;
    if (a === missing || b === missing) return false;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => same(v, b[i]));
    if (object(a) && object(b)) {
      const keys = Object.keys(a);
      return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
    }
    return false;
  };
  function fingerprint(value) {
    if (Array.isArray(value)) return "[" + value.map(fingerprint).join(",") + "]";
    if (object(value)) return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + fingerprint(value[k])).join(",") + "}";
    return JSON.stringify(value);
  }
  function union(left, right) {
    const result = [], seen = new Set();
    for (const value of [...left, ...right]) {
      const key = fingerprint(value);
      if (!seen.has(key)) { result.push(clone(value)); seen.add(key); }
    }
    return result;
  }
  function entries(array) {
    if (!Array.isArray(array) || !array.every(v => object(v) && typeof v.id === "string" && v.id)) return null;
    const map = new Map(array.map(v => [v.id, v]));
    return map.size === array.length ? map : null;
  }
  function reviewTime(progress) {
    const n = new Date(progress?.card?.last_review || progress?.lastReviewedAt || progress?.learnedAt || 0).getTime();
    return Number.isFinite(n) ? n : 0;
  }
  function merge(base, local, remote, options = {}) {
    const conflicts = [];
    function combine(b, l, r, path) {
      if (same(l, r)) return clone(l);
      if (same(l, b)) return clone(r);
      if (same(r, b)) return clone(l);

      // A scheduled card is atomic: never combine one device's due date with another's stability.
      if (path.length === 2 && ["vocabProgress", "expressionProgress"].includes(path[0]) && object(l) && object(r)) {
        const rebuilt = options.rebuildProgress?.(path, b === missing ? null : b, l, r);
        if (rebuilt) return rebuilt;
        const winner = reviewTime(l) > reviewTime(r) ? l : reviewTime(r) > reviewTime(l) ? r :
          (Number(l.reviews) || 0) > (Number(r.reviews) || 0) ? l : r;
        const copy = clone(winner);
        const dates = [l.learnedAt, r.learnedAt].filter(n => Number.isFinite(n) && n > 0);
        if (dates.length) copy.learnedAt = Math.min(...dates);
        conflicts.push({ path: path.join("."), kind: "review", local: clone(l), remote: clone(r) });
        return copy;
      }
      // An unfinished group is an indivisible cursor, including its phase and word IDs.
      if ((path.length === 2 && ["learningSessions", "expressionSessions"].includes(path[0])) ||
          (path.length === 1 && ["learningSession", "expressionSession", "studioCursor"].includes(path[0]))) {
        conflicts.push({ path: path.join("."), kind: "session", local: l === missing ? null : clone(l), remote: r === missing ? null : clone(r) });
        return clone(r);
      }
      if (object(l) && object(r) && (b === missing || object(b))) {
        const result = {};
        const keys = new Set([...Object.keys(b === missing ? {} : b), ...Object.keys(l), ...Object.keys(r)]);
        for (const key of keys) {
          if (dangerous.has(key)) continue;
          const value = combine(b !== missing && Object.hasOwn(b, key) ? b[key] : missing,
            Object.hasOwn(l, key) ? l[key] : missing, Object.hasOwn(r, key) ? r[key] : missing, [...path, key]);
          if (value !== missing) result[key] = value;
        }
        return result;
      }
      if (Array.isArray(l) && Array.isArray(r)) {
        if (appendOnly.has(path[0])) {
          const values = union(l, r);
          if (["studyLog", "expressionLog"].includes(path[0])) values.sort((a, b) => Number(a.at) - Number(b.at));
          return values;
        }
        const lm = entries(l), rm = entries(r), bm = entries(b === missing ? [] : b);
        if (lm && rm && bm) {
          const result = [];
          for (const id of new Set([...rm.keys(), ...lm.keys(), ...bm.keys()])) {
            const value = combine(bm.has(id) ? bm.get(id) : missing, lm.has(id) ? lm.get(id) : missing,
              rm.has(id) ? rm.get(id) : missing, [...path, id]);
            if (value !== missing) result.push(value);
          }
          return result;
        }
      }
      conflicts.push({ path: path.join("."), kind: "content", local: l === missing ? null : clone(l), remote: r === missing ? null : clone(r) });
      return clone(r);
    }
    const state = combine(base || {}, local || {}, remote || {}, []);
    if (state.learningSessions) {
      const current = state.learningSession;
      state.learningSession = current?.skill && state.learningSessions[current.skill] || null;
    }
    return { state, conflicts };
  }
  root.StudySyncModel = { merge, same, fingerprint };
})(typeof window === "undefined" ? globalThis : window);
