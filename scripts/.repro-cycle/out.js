(() => {
  // scripts/.repro-cycle/a.js
  var A = class {
  };

  // scripts/.repro-cycle/b.js
  var B = class extends A {
  };
})();
