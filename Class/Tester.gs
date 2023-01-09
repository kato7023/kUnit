/**
 * テストコードを提供するクラス
 * 【使用方法】
 * １．グローバル関数のテスト
 * 　　const TEST = Tester.init()
 * 　　全てのグローバル関数を取得し、関数名をプロパティとしてテストオブジェクトを格納する
 * 　　TEST.関数名　で、関数のテストオブジェクトを取得可能
 * ２．クラスのメソッドのテスト
 * 　　const TEST = Tester.initForClass(class, arg1, arg2, ...)
 * 　　対象クラスの全てのメソッドを取得し、関数名をプロパティについて各テストオブジェクトを格納する
 * 　　ただし、arg1...は、コンストラクターの引数
 * ３．define系メソッド　ー　各テストオブジェクトに、パラメーターを設定する
 * 　　A.　defineArgs(arg1, arg2, arg3...) 対象の関数の引数を設定する
 * 　　B.　defineTestFunc(test) テスト用関数を設定する
 * 　　C.　defineExpectation(title, expectation, manipulate) テストのタイトルと予想される結果、戻り値の操作を設定する
 * ４．assert系メソッド　ー　テストを実行し、ログを出力する。assert系メソッドの戻り値は、チェーンメソッド用に新しいテストインスタンスを返す
 * 　　A.　assert() テストを実行
 * 　　　※以下、戻り値の期待値を　各メソッドにて設定してテスト実行
 * 　　B.　assertTrue() trueである
 * 　　C.　assertMoreThan(num) numより大きい
 * 　　D.　assertMoreThanEqual(num) num以上
 * 　　E.　assertLessThan(num) numより小さい
 * 　　F.　assertLessThanEqual(num) num以下
 * 　　G.　assertEqual(value) valueと等しい
 * 　　H.　assertNotEqual(value) valueと等しく無い
 * 　　I.　assertArray()　配列である
 * 　　J.　assert2DArray() 行列の２次元配列である
 * 【使用例】
 * function test() {
 * 
 *   const TEST = Tester.init();
 * 
 *   TEST.getAllCalendars
 *     .defineExpectation('returnが配列である')
 *     .assertArray()
 * 
 *     .defineExpectation('.getName()を使用できる', '.every(c => c.getName())')
 *     .assert();
 *   const calendar = getAllCalendars()[0];
 * 
 *   TEST.getCalendarEvents
 *     .defineArgs(calendar, new Date('2022/9/1'), new Date('2022/10/31'))
 *     .defineExpectation('returnが配列である')
 *     .assertArray()
 * 
 *     .defineArgs(calendar, new Date('2022/9/1'), new Date('2022/10/31'))
 *     .defineExpectation('.getTitle()を使用できる', '.every(e => e.getTitle())')
 *     .assert();
 *   const events = getCalendarEvents(calendar, new Date('2022/9/1'), new Date('2022/10/31'));
 * 
 *   TEST.getStartDate
 *     .defineArgs(new Date('2022/10/14'))
 *     .defineExpectation('2022/10/1を取得する', '=== new Date("2022/10/1").getTime()', '.getTime()')
 *     .assert()
 * 
 *     .defineArgs(new Date('2022/10/14'))
 *     .defineExpectation('2022/10/1を取得する(Dateオブジェクトで比較)', new Date("2022/10/1"))
 *     .assert()
 * 
 *     .defineArgs(new Date())
 *     .defineTestFunc(() => {
 *       const date = new Date();
 *       return TEST.getStartDate.func(date) - date;
 *     })
 *     .defineExpectation('関数が引数のdateを壊さない')
 *     .assertNotEqual(0);
 * }
 */

class Tester {
  /**
   * @constructor
   * @param {Function} func - テスト対象の関数
   */
  constructor(func) {
    if (typeof func !== 'function') throw 'funcは関数を指定してください';
    this.name = func.name;
    this.func = func;
    this.result = 'テスト未実施';
    this.title = `【${this.name}】`;
    this.statement = '';
    this.equalMode = false;
  }

  /**
   * テスト対象の関数に引数を設定する
   * @param {...any} args - 可変長引数で、引数を設定する
   * @return {Tester} - チェーンメソッド用にthisを返す
   */
  defineArgs(...args) {
    this.args = args;
    args.forEach((arg, i) => {
      this.statement += `\t(第${i + 1}引数)${arg}\n`;
    });
    return this;
  }

  /**
   * テスト対象の関数に適用するテスト関数を設定する
   * @param {Function} test - テスト関数を関数オブジェクトで渡す
   * @return {Tester} - チェーンメソッド用にthisを返す
   */
  defineTestFunc(test) {
    this.statement += `\t(testFunc)${test.toString().replace(/(\n|\r|\t|\s{3,})/g, ' ')}\n`;
    this.mode = 'testFunc';
    this.testFunc = test;
    return this;
  }

  /**
   * テスト対象の関数にの戻り値の期待値を設定する
   * @param {string} title - テスト結果のログのタイトルを設定（eg.戻り値が配列である）
   * @param {string|object} expectation - 戻り値と比較する結果を設定。条件式の比較演算子以降を文字列で渡す（eg.'=== 10' 戻り値の期待値が10の場合）
   * @param {string} manipulate - 戻り値に加えたい処理を設定。戻り値以降を文字列で渡す（eg.'.getDate()' 戻り値はDateオブジェクトだが、そこから日付のみ取得したい場合）
   * @return {Tester} - チェーンメソッド用にthisを返す
   */
  defineExpectation(title, expectation, manipulate) {
    if (typeof expectation === 'object') this.equalMode = true;
    this.title += `(期待値)${title}`;
    this.expectation = expectation;
    this.manipulate = manipulate;
    return this;
  }

  /**
   * 戻り値の期待値をtrueに設定してから、テストを実行する
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertTrue() {
    this.expectation = '=== true';
    return this.assert();
  }

  /**
   * 戻り値の期待値をnumより大きいに設定してから、テストを実行する
   * @param {number} num
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertMoreThan(num) {
    this.expectation = '> ' + num;
    return this.assert();

  }

  /**
   * 戻り値の期待値をnum以上に設定してから、テストを実行する
   * @param {number} num
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertMoreThanEqual(num) {
    this.expectation = '>= ' + num;
    return this.assert();
  }

  /**
   * 戻り値の期待値をnumより小さいに設定してから、テストを実行する
   * @param {number} num
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertLessThan(num) {
    this.expectation = '< ' + num;
    return this.assert();
  }

  /**
   * 戻り値の期待値をnum以下に設定してから、テストを実行する
   * @param {number} num
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertLessThanEqual(num) {
    this.expectation = '<= ' + num;
    return this.assert();
  }

  /**
   * 戻り値の期待値をvalueと等しいに設定してから、テストを実行する
   * @param {any} value
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertEqual(value) {
    this.expectation = '=== ' + value;
    return this.assert();
  }

  /**
   * 戻り値の期待値をvalueと等しくないに設定してから、テストを実行する
   * @param {any} value
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertNotEqual(value) {
    this.expectation = '!== ' + value;
    return this.assert();
  }

  /**
   * 戻り値の期待値を配列であるに設定してから、テストを実行する
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assertArray() {
    this.expectation = 'instanceof Array';
    return this.assert();
  }

  /**
   * 戻り値の期待値を行列の長さの揃った2次元配列であるに設定してから、テストを実行する
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assert2DArray() {
    this.defineTestFunc((self) => {
      const array = self.run();
      return array.every(v => v instanceof Array)
        && array[0].every(v => !(v instanceof Array)
          && array.every(v => array[0].length === v.length));
    });
    return this.assertTrue();
  }

  /**
   * defineで設定した各パラメーターに則って、テストを実行してログ出力する
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  assert() {
    if (!this.testFunc) {
      this.result = this._manipulateResult(this.run());
      if (!this.equalMode) this.bool = this._excuteFunction();
      else this.bool = this._equals(this.result, this.expectation)
    } else {
      this.result = this._manipulateResult(this.testFunc(this));
      if (this.expectation === undefined) this.simpleExcution = true;
      else if (!this.equalMode) this.bool = this._excuteFunction();
      else this.bool = this._equals(this.result, this.expectation);
    }

    this._logStatement();
    return new Tester(this.func);
  }


  /**
   * 対象の関数を単純実行する
   * @return {any} 関数を実行した戻り値
   */
  run() {
    if (!this.args) return this.func();
    return this.func(...this.args);
  }

  /**
   * 対象の関数の単純実行した戻り値をログ出力する
   * @param {boolean} stringify - 戻り値をJSON.stringfyするかどうかを真偽値で設定。デフォルトはfasle。
   * @return {Tester} チェーンメソッド用に、新しいTesterクラスのインスタンスを返す。（各パラメーター、引数はリセットされている）
   */
  showLog(stringify = false) {
    if (stringify) console.log(`【${this.name}】LOG:\n${JSON.stringify(this.run())}`);
    else console.log(`【${this.name}】LOG:\n${this.run()}`)
    return new Tester(this.func);
  }

  /**
 * 2つの値を比較して等しいか判定する
 * @param {any} obj1 - 比較対象１
 * @param {any} obj2 - 比較対象２
 * @return {boolean} 比較結果の真偽値
 */
  _equals(obj1, obj2) {
    if (typeof obj1 !== 'object') return obj1 === obj2;
    if (obj1 instanceof Date) return obj1.toString() === obj2.toString();
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    for (const [key, value] of Object.entries(obj1)) {
      if (!this._equals(value, obj2[key])) return false;
    }
    return true;
  }

  /**
   * assert()実行時の処理。
   */
  _excuteFunction() {
    if (this.expectation === undefined) throw 'defineExpectationを実行してください';
    // if (this.result === undefined) throw 'this.resultが設定されていません';
    return new Function('result', `
      const bool = result ${this.expectation};
      if(typeof bool !== 'boolean') {
        throw 'テストの結果が真偽値で返ってきていません。defineExpectationメソッドで条件式の右辺を設定してください。';
      }
      return bool;
    `)(this.result);
  }

  /**
 * manipulateが設定されているときの処理。
 */
  _manipulateResult(result) {
    if (!this.manipulate) return result;
    return new Function('result', `
      return result ${this.manipulate};
    `)(result);
  }

  /**
   * テスト結果のログ出力
   */
  _logStatement() {

    if (this.simpleExcution) {
      console.log(`TestFuncのreturn　【${this.name}】\n\t${this.result}`);
      return;
    }
    if (this.bool) {
      console.log(`◯Success!　${this.title}\n${this.statement}`);
    } else {
      let expected;
      try {
        expected = new Function(`
        return ${this.expectation.replace(/(===|!==|>|<|>=|<=)\s/, '')};
        `)()
      } catch (e) {
        expected = this.expectation;
      };
      console.log(`✕Failed!　${this.title}\n${this.statement}\n\t(実行値) ${this.result}\n\t(期待値) ${expected}`);
    }
  }

  /**
   * 開始処理。全てのグローバル関数を取得して、Testerインスタンスを格納する。
   * 【使用例】
   * const TEST = Tester.init();
   * TEST.functionName
   *   .defineExpectation('returnが配列である')
   *   .assertArray();
   */
  static init(global = globalThis) {
    const test = {};
    Object.keys(global)
      .filter(key => typeof global[key] === 'function')
      .forEach(funcName => test[funcName] = new Tester(global[funcName]));
    return test;
  }

  /**
   * 開始処理。クラスの全てのメソッドを取得して、Testerインスタンスを格納する。
   * 【使用例】
   * class Test {
   *   constructor(a,b) {
   *     this.a = a;
   *     this.b = b;
   *   }
   *   testMethod() {
   *     return 'test excuted';
   *   }
   *   testMethod2() {
   *     return 'kato';
   *   }
   * }
   * 
   * function myFunction() {
   *   const TEST = Tester.initForClass(Test,'kato', 'sato');
   *   TEST.testMethod
   *     .defineExpectation('戻り値が「test excuted」である', '=== "test excuted"')
   *     .assert();
   *   TEST.testMethod2
   *     .defineExpectation('戻り値が「kato」である', '=== "kato"')
   *     .assert();
   * }
   * 
   * @param {Class} targetClass - テスト対象のクラス
   * @param {...args} args - コンストラクターの引数
   */

  static initForClass(targetClass, ...args) {

    const test = {};
    const targetInstance = new targetClass(...args);
    getMethods(targetInstance)
      .forEach(method => test[method] = new Tester(targetInstance[method]));
    return test;

    function getMethods(obj) {
      const excludeList = [
        'constructor',
        '__defineGetter__',
        '__defineSetter__',
        'hasOwnProperty',
        '__lookupGetter__',
        '__lookupSetter__',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'valueOf',
        '__proto__',
        'toLocaleString'
      ];
      const methods = [];
      while (obj) {
        methods.push(
          ...Object.getOwnPropertyNames(obj)
            .filter(item => !excludeList.includes(item))
            .filter(item => typeof obj[item] === 'function')
        );
        obj = Object.getPrototypeOf(obj);
      }
      return methods;
    }
  }

}

/** ライブラリ用にグローバル登録 */
this.Tester = Tester;
