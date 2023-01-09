function experiment1() {
  return ['a', 'b', 'c'];
}

function experiment2() {
  return null;
}

function expe_test() {
  const TEST = Tester.init();

  TEST.experiment1
    .defineExpectation('とりあえず', '[0] === "a"')
    .assert();

  TEST.experiment2
    .defineExpectation('戻り値がundefined', '=== undefined')
    .assert()

    .defineArgs('a', 'b', 'c')
    .defineExpectation('引数を与えても結果に影響しない', '=== true')
    .defineTestFunc((self) => {
      return self.run();
    })
    .assert();
}

class Test {
  constructor(a,b) {
    this.a = a;
    this.b = b;
  }
  testMethod() {
    return 'test excuted';
  }
  testMethod2() {
    return 'kato';
  }
}

function myClassTest() {
  const TEST = Tester.initForClass(Test,'kato', 'sato');
  TEST.testMethod
    .defineExpectation('戻り値が「test excuted」である', '=== "test excuted"')
    .assert();
  TEST.testMethod2
    .defineExpectation('戻り値が「kato」である', '=== "kato"')
    .assert();
}

// class Test {
//   constructor(a, b) {
//     this.a = a;
//     this.b = b;
//   }
//   testMethod() {
//     return 'test excuted';
//   }
//   testMethod2() {
//     return 'kato';
//   }
// }

// function myClassTest() {
//   const TEST = Tester.initForClass(Test, 'kato', 'sato');
//   TEST.testMethod
//     .defineExpectation('戻り値が「test excuted」である', '=== "test excuted"')
//     .assert();
//   TEST.testMethod2
//     .defineExpectation('戻り値が「kato」である', '=== "kato"')
//     .assert();
// }


// const excludeList = [
//   // 'constructor',
//   // '__defineGetter__',
//   // '__defineSetter__',
//   // 'hasOwnProperty',
//   // '__lookupGetter__',
//   // '__lookupSetter__',
//   // 'isPrototypeOf',
//   // 'propertyIsEnumerable',
//   // 'toString',
//   // 'valueOf',
//   // '__proto__',
//   // 'toLocaleString'
// ];
// const getMethods = (obj) => {
//   const methods = [];
//   while(obj) {
//     methods.push(...Object.getOwnPropertyNames(obj)
//       .filter(item => !excludeList.includes(item))
//       .filter(item => typeof obj[item] === 'function')  
//     );
//     obj = Object.getPrototypeOf(obj);
//   }
//   return methods;
// }

// function myMethodTest() {
//   console.log(getMethods(new Test('kato', 'sato')));
//   console.log(Object.getOwnPropertyNames(Test.prototype));
// }

