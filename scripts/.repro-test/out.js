(() => {
  // scripts/.repro-test/a.js
  var A = class {
  };

  // scripts/.repro-test/b.js
  var B = class extends A {
  };
})();
