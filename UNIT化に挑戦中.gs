function uni_test() {
  const TEST = new TestSuite();
  TEST.myFunction
    .setUp()
    .defineArgs(1,2,3,4,5)
    .run()
  console.log(TEST.uni_myFunction.log.summary());
}

function uni_myFunction() {

}

class TestSuite {

  constructor() {
    Object.keys(globalThis)
      .filter(key => typeof globalThis[key] === 'function')
      .forEach(funcName => this[funcName] = new TestCase(globalThis[funcName]));
  }

  run() {

  }
}

class TestCase {
  constructor(func) {
    if (typeof func !== 'function') throw 'funcは関数を指定してください';
    this.name = func.name;
    this.func = func;
    this.log = new TestResult_();
  }

  setUp() {
    this.log.add('setUp excuted').addNewLine();
    this.log.functionName = this.name;
    return this;
  }

  defineArgs(...args) {
    this.log.add('defineArgs excuted').addNewLine();
    this.args = args;
    args.forEach((arg, i) => this.log.add(`(第${i+1}引数)${arg}`).addNewLine());
    return this;
  }

  defineTestFunc(test) {
    this.log.add('defineTestFunc excuted').addNewLine();
    this.testFunc = test;
    this.log.add(`(testFunc) ${test.toString()}`).addNewLine();
    return this;
  }

  defineExpectation(title, expectation, modification) {
    this.log.add('defineExpectation excuted').addNewLine();
    this.compare = new Comparison(this.log, expectation, modification);
    this.log.title = title;

  }

  run() {
    this.setUp();
    this.log.add('run excuted');
    if(this.testFunc) {
      this.log.add(' for testFunc').addNewLine();
      this.log.returnValue = this.testFunc(this); //testFuncの引数をselfなどで受けると、thisを継承できる
    }
    if(!this.args) {
      this.log.add(' without args').addNewLine();
      this.log.returnValue = this.func();
    } else {
      this.log.add(' with args').addNewLine();
      this.log.returnValue = this.func(...this.args);
    }
    this.log.add(`return value was ${this.log.returnValue}`).addNewLine();
    return new TestCase(this.func);
  }

  tearDown() {
    this.log.add('tearDown excuted').addNewLine();
  }



}

class Comparison {
  constructor(result, expectation, modification) {
    
  }

  defineExpectation() {

  }

  assert() {

  }
}

class TestResult_ {
  constructor() {
    this.errorCount = 0;
    this.runCount = 0;
    this.functionName = '';
    this.title = '';
    this.resultSymbol = '';
    this.returnValue = 'not returned yet';
    this.log = '';
  }

  testStarted() {
    this.runCount++;
  }

  testFailed() {
    this.errorCount++;
  }

  add(log) {
    this.log += log;
    return this;
  }

  addNewLine() {
    this.log += '\n';
    return this;
  }

  addTab() {
    this.log += '\t';
    return this;
  }

  summary() {
    return `${this.runCount} test run. ${this.errorCount} failed. \n  ${this.resultSymbol}【${this.functionName}】${this.title}`;
  }
}



