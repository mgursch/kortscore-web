// GENERIERT, nicht bearbeiten. Quelle: kortform-kmp, Modul :itn-core, Commit a954f48.
// Neu erzeugen mit tools/sync_itn_core.sh.
//region block: polyfills
if (typeof Math.imul === 'undefined') {
  Math.imul = function imul(a, b) {
    return (a & 4.29490176E9) * (b & 65535) + (a & 65535) * (b | 0) | 0;
  };
}
if (typeof ArrayBuffer.isView === 'undefined') {
  ArrayBuffer.isView = function (a) {
    return a != null && a.__proto__ != null && a.__proto__.__proto__ === Int8Array.prototype.__proto__;
  };
}
//endregion
//region block: imports
var imul_0 = Math.imul;
var isView = ArrayBuffer.isView;
//endregion
//region block: pre-declaration
initMetadataForInterface(CharSequence, 'CharSequence');
initMetadataForClass(Number_0, 'Number');
initMetadataForClass(asIterable$$inlined$Iterable$1);
initMetadataForClass(Char, 'Char');
initMetadataForInterface(Collection, 'Collection');
initMetadataForCompanion(Companion);
initMetadataForClass(Enum, 'Enum');
initMetadataForCompanion(Companion_0);
initMetadataForClass(Long, 'Long', VOID, Number_0);
initMetadataForObject(Digit, 'Digit');
initMetadataForObject(Unit, 'Unit');
initMetadataForClass(AbstractCollection, 'AbstractCollection', VOID, VOID, [Collection]);
initMetadataForClass(AbstractMutableCollection, 'AbstractMutableCollection', VOID, AbstractCollection, [Collection]);
initMetadataForClass(IteratorImpl, 'IteratorImpl');
initMetadataForClass(AbstractMutableList, 'AbstractMutableList', VOID, AbstractMutableCollection, [Collection]);
initMetadataForCompanion(Companion_1);
initMetadataForClass(ArrayList, 'ArrayList', ArrayList_init_$Create$, AbstractMutableList, [Collection]);
initMetadataForClass(Exception, 'Exception', Exception_init_$Create$, Error);
initMetadataForClass(RuntimeException, 'RuntimeException', RuntimeException_init_$Create$, Exception);
initMetadataForClass(UnsupportedOperationException, 'UnsupportedOperationException', UnsupportedOperationException_init_$Create$, RuntimeException);
initMetadataForClass(IllegalArgumentException, 'IllegalArgumentException', IllegalArgumentException_init_$Create$, RuntimeException);
initMetadataForClass(NoSuchElementException, 'NoSuchElementException', NoSuchElementException_init_$Create$, RuntimeException);
initMetadataForClass(IndexOutOfBoundsException, 'IndexOutOfBoundsException', IndexOutOfBoundsException_init_$Create$, RuntimeException);
initMetadataForClass(IllegalStateException, 'IllegalStateException', IllegalStateException_init_$Create$, RuntimeException);
initMetadataForClass(NumberFormatException, 'NumberFormatException', NumberFormatException_init_$Create$, IllegalArgumentException);
initMetadataForClass(ClassCastException, 'ClassCastException', ClassCastException_init_$Create$, RuntimeException);
initMetadataForClass(KClassImpl, 'KClassImpl');
initMetadataForClass(PrimitiveKClassImpl, 'PrimitiveKClassImpl', VOID, KClassImpl);
initMetadataForClass(StringBuilder, 'StringBuilder', StringBuilder_init_$Create$_0, VOID, [CharSequence]);
initMetadataForClass(sam$kotlin_Comparator$0, 'sam$kotlin_Comparator$0');
initMetadataForCompanion(Companion_2);
initMetadataForClass(IntIterator, 'IntIterator');
initMetadataForCompanion(Companion_3);
initMetadataForClass(IntProgression, 'IntProgression');
initMetadataForClass(IntRange, 'IntRange', VOID, IntProgression);
initMetadataForClass(IntProgressionIterator, 'IntProgressionIterator', VOID, IntIterator);
initMetadataForCompanion(Companion_4);
initMetadataForClass(DelimitedRangesSequence$iterator$1);
initMetadataForClass(DelimitedRangesSequence, 'DelimitedRangesSequence');
initMetadataForClass(Pair, 'Pair');
initMetadataForClass(SinglesInput, 'SinglesInput');
initMetadataForClass(DoublesInput, 'DoublesInput');
initMetadataForClass(Projection, 'Projection');
initMetadataForClass(WinKind, 'WinKind', VOID, Enum);
initMetadataForClass(SinglesResult, 'SinglesResult');
initMetadataForClass(SinglesFactors, 'SinglesFactors');
initMetadataForClass(DoublesResult, 'DoublesResult');
initMetadataForObject(ItnCalculator, 'ItnCalculator');
initMetadataForObject(ItnFormat, 'ItnFormat');
initMetadataForObject(ItnInputParser, 'ItnInputParser');
initMetadataForClass(AgeGroup, 'AgeGroup', VOID, Enum);
initMetadataForClass(MatchFormat, 'MatchFormat', VOID, Enum);
initMetadataForClass(SafetyStatus, 'SafetyStatus', VOID, Enum);
initMetadataForClass(ItnSinglesView, 'ItnSinglesView');
initMetadataForClass(ItnDoublesView, 'ItnDoublesView');
//endregion
function CharSequence() {
}
function Number_0() {
}
function joinToString(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
  separator = separator === VOID ? ', ' : separator;
  prefix = prefix === VOID ? '' : prefix;
  postfix = postfix === VOID ? '' : postfix;
  limit = limit === VOID ? -1 : limit;
  truncated = truncated === VOID ? '...' : truncated;
  transform = transform === VOID ? null : transform;
  return joinTo(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
}
function joinTo(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
  separator = separator === VOID ? ', ' : separator;
  prefix = prefix === VOID ? '' : prefix;
  postfix = postfix === VOID ? '' : postfix;
  limit = limit === VOID ? -1 : limit;
  truncated = truncated === VOID ? '...' : truncated;
  transform = transform === VOID ? null : transform;
  buffer.append_jgojdo_k$(prefix);
  var count = 0;
  var inductionVariable = 0;
  var last = _this__u8e3s4.length;
  $l$loop: while (inductionVariable < last) {
    var element = _this__u8e3s4[inductionVariable];
    inductionVariable = inductionVariable + 1 | 0;
    count = count + 1 | 0;
    if (count > 1) {
      buffer.append_jgojdo_k$(separator);
    }
    if (limit < 0 || count <= limit) {
      appendElement(buffer, element, transform);
    } else
      break $l$loop;
  }
  if (limit >= 0 && count > limit) {
    buffer.append_jgojdo_k$(truncated);
  }
  buffer.append_jgojdo_k$(postfix);
  return buffer;
}
function single(_this__u8e3s4) {
  var tmp;
  switch (_this__u8e3s4.length) {
    case 0:
      throw NoSuchElementException_init_$Create$_0('Array is empty.');
    case 1:
      tmp = _this__u8e3s4[0];
      break;
    default:
      throw IllegalArgumentException_init_$Create$_0('Array has more than one element.');
  }
  return tmp;
}
function joinToString_0(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
  separator = separator === VOID ? ', ' : separator;
  prefix = prefix === VOID ? '' : prefix;
  postfix = postfix === VOID ? '' : postfix;
  limit = limit === VOID ? -1 : limit;
  truncated = truncated === VOID ? '...' : truncated;
  transform = transform === VOID ? null : transform;
  return joinTo_0(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
}
function joinTo_0(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
  separator = separator === VOID ? ', ' : separator;
  prefix = prefix === VOID ? '' : prefix;
  postfix = postfix === VOID ? '' : postfix;
  limit = limit === VOID ? -1 : limit;
  truncated = truncated === VOID ? '...' : truncated;
  transform = transform === VOID ? null : transform;
  buffer.append_jgojdo_k$(prefix);
  var count = 0;
  var _iterator__ex2g4s = _this__u8e3s4.iterator_jk1svi_k$();
  $l$loop: while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
    var element = _iterator__ex2g4s.next_20eer_k$();
    count = count + 1 | 0;
    if (count > 1) {
      buffer.append_jgojdo_k$(separator);
    }
    if (limit < 0 || count <= limit) {
      appendElement(buffer, element, transform);
    } else
      break $l$loop;
  }
  if (limit >= 0 && count > limit) {
    buffer.append_jgojdo_k$(truncated);
  }
  buffer.append_jgojdo_k$(postfix);
  return buffer;
}
function until(_this__u8e3s4, to) {
  if (to <= -2147483648)
    return Companion_getInstance_3().EMPTY_1;
  return numberRangeToNumber(_this__u8e3s4, to - 1 | 0);
}
function downTo(_this__u8e3s4, to) {
  return Companion_instance_4.fromClosedRange_y6bqsv_k$(_this__u8e3s4, to, -1);
}
function coerceAtMost(_this__u8e3s4, maximumValue) {
  return _this__u8e3s4 > maximumValue ? maximumValue : _this__u8e3s4;
}
function coerceAtLeast(_this__u8e3s4, minimumValue) {
  return _this__u8e3s4 < minimumValue ? minimumValue : _this__u8e3s4;
}
function coerceIn(_this__u8e3s4, minimumValue, maximumValue) {
  if (minimumValue > maximumValue)
    throw IllegalArgumentException_init_$Create$_0('Cannot coerce value to an empty range: maximum ' + maximumValue + ' is less than minimum ' + minimumValue + '.');
  if (_this__u8e3s4 < minimumValue)
    return minimumValue;
  if (_this__u8e3s4 > maximumValue)
    return maximumValue;
  return _this__u8e3s4;
}
function coerceIn_0(_this__u8e3s4, minimumValue, maximumValue) {
  if (minimumValue > maximumValue)
    throw IllegalArgumentException_init_$Create$_0('Cannot coerce value to an empty range: maximum ' + maximumValue + ' is less than minimum ' + minimumValue + '.');
  if (_this__u8e3s4 < minimumValue)
    return minimumValue;
  if (_this__u8e3s4 > maximumValue)
    return maximumValue;
  return _this__u8e3s4;
}
function asIterable(_this__u8e3s4) {
  // Inline function 'kotlin.collections.Iterable' call
  return new asIterable$$inlined$Iterable$1(_this__u8e3s4);
}
function asIterable$$inlined$Iterable$1($this_asIterable) {
  this.$this_asIterable_1 = $this_asIterable;
}
protoOf(asIterable$$inlined$Iterable$1).iterator_jk1svi_k$ = function () {
  return this.$this_asIterable_1.iterator_jk1svi_k$();
};
function _Char___init__impl__6a9atx(value) {
  return value;
}
function _get_value__a43j40($this) {
  return $this;
}
function Char__compareTo_impl_ypi4mb($this, other) {
  return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
}
function Char__minus_impl_a2frrh($this, other) {
  return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
}
function Char__toInt_impl_vasixd($this) {
  return _get_value__a43j40($this);
}
function toString($this) {
  // Inline function 'kotlin.js.unsafeCast' call
  return String.fromCharCode(_get_value__a43j40($this));
}
function Char() {
}
function Collection() {
}
function Companion() {
}
var Companion_instance;
function Companion_getInstance() {
  return Companion_instance;
}
function Enum(name, ordinal) {
  this.name_1 = name;
  this.ordinal_1 = ordinal;
}
protoOf(Enum).compareTo_30rs7w_k$ = function (other) {
  return compareTo(this.ordinal_1, other.ordinal_1);
};
protoOf(Enum).compareTo_hpufkf_k$ = function (other) {
  return this.compareTo_30rs7w_k$(other instanceof Enum ? other : THROW_CCE());
};
protoOf(Enum).equals = function (other) {
  return this === other;
};
protoOf(Enum).toString = function () {
  return this.name_1;
};
function toString_0(_this__u8e3s4) {
  var tmp1_elvis_lhs = _this__u8e3s4 == null ? null : toString_1(_this__u8e3s4);
  return tmp1_elvis_lhs == null ? 'null' : tmp1_elvis_lhs;
}
function Companion_0() {
  Companion_instance_0 = this;
  this.MIN_VALUE_1 = new Long(0, -2147483648);
  this.MAX_VALUE_1 = new Long(-1, 2147483647);
  this.SIZE_BYTES_1 = 8;
  this.SIZE_BITS_1 = 64;
}
var Companion_instance_0;
function Companion_getInstance_0() {
  if (Companion_instance_0 == null)
    new Companion_0();
  return Companion_instance_0;
}
function Long(low, high) {
  Companion_getInstance_0();
  Number_0.call(this);
  this.low_1 = low;
  this.high_1 = high;
}
protoOf(Long).compareTo_kvbqny_k$ = function (other) {
  return compare(this, other);
};
protoOf(Long).compareTo_hpufkf_k$ = function (other) {
  return this.compareTo_kvbqny_k$(other instanceof Long ? other : THROW_CCE());
};
protoOf(Long).toString = function () {
  return toStringImpl(this, 10);
};
protoOf(Long).valueOf = function () {
  return toNumber(this);
};
function charArrayOf(arr) {
  var tmp0 = 'CharArray';
  // Inline function 'withType' call
  var array = new Uint16Array(arr);
  array.$type$ = tmp0;
  // Inline function 'kotlin.js.unsafeCast' call
  return array;
}
function get_ZERO() {
  _init_properties_boxedLong_kt__v24qrw();
  return ZERO;
}
var ZERO;
function get_ONE() {
  _init_properties_boxedLong_kt__v24qrw();
  return ONE;
}
var ONE;
function get_NEG_ONE() {
  _init_properties_boxedLong_kt__v24qrw();
  return NEG_ONE;
}
var NEG_ONE;
function get_MAX_VALUE() {
  _init_properties_boxedLong_kt__v24qrw();
  return MAX_VALUE;
}
var MAX_VALUE;
function get_MIN_VALUE() {
  _init_properties_boxedLong_kt__v24qrw();
  return MIN_VALUE;
}
var MIN_VALUE;
function get_TWO_PWR_24_() {
  _init_properties_boxedLong_kt__v24qrw();
  return TWO_PWR_24_;
}
var TWO_PWR_24_;
var longArrayClass;
function compare(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  if (equalsLong(_this__u8e3s4, other)) {
    return 0;
  }
  var thisNeg = isNegative(_this__u8e3s4);
  var otherNeg = isNegative(other);
  return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : isNegative(subtract(_this__u8e3s4, other)) ? -1 : 1;
}
function convertToInt(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.low_1;
}
function toNumber(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.high_1 * 4.294967296E9 + getLowBitsUnsigned(_this__u8e3s4);
}
function toStringImpl(_this__u8e3s4, radix) {
  _init_properties_boxedLong_kt__v24qrw();
  if (isZero(_this__u8e3s4)) {
    return '0';
  }
  if (isNegative(_this__u8e3s4)) {
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      var radixLong = fromInt(radix);
      var div = divide(_this__u8e3s4, radixLong);
      var rem = convertToInt(subtract(multiply(div, radixLong), _this__u8e3s4));
      var tmp = toStringImpl(div, radix);
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      return tmp + rem.toString(radix);
    } else {
      return '-' + toStringImpl(negate(_this__u8e3s4), radix);
    }
  }
  var digitsPerTime = radix === 2 ? 31 : radix <= 10 ? 9 : radix <= 21 ? 7 : radix <= 35 ? 6 : 5;
  var radixToPower = fromNumber(Math.pow(radix, digitsPerTime));
  var rem_0 = _this__u8e3s4;
  var result = '';
  while (true) {
    var remDiv = divide(rem_0, radixToPower);
    var intval = convertToInt(subtract(rem_0, multiply(remDiv, radixToPower)));
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var digits = intval.toString(radix);
    rem_0 = remDiv;
    if (isZero(rem_0)) {
      return digits + result;
    } else {
      while (digits.length < digitsPerTime) {
        digits = '0' + digits;
      }
      result = digits + result;
    }
  }
}
function equalsLong(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.high_1 === other.high_1 && _this__u8e3s4.low_1 === other.low_1;
}
function fromInt(value) {
  _init_properties_boxedLong_kt__v24qrw();
  return new Long(value, value < 0 ? -1 : 0);
}
function isNegative(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.high_1 < 0;
}
function subtract(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return add(_this__u8e3s4, negate(other));
}
function getLowBitsUnsigned(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.low_1 >= 0 ? _this__u8e3s4.low_1 : 4.294967296E9 + _this__u8e3s4.low_1;
}
function isZero(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return _this__u8e3s4.high_1 === 0 && _this__u8e3s4.low_1 === 0;
}
function multiply(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  if (isZero(_this__u8e3s4)) {
    return get_ZERO();
  } else if (isZero(other)) {
    return get_ZERO();
  }
  if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
    return isOdd(other) ? get_MIN_VALUE() : get_ZERO();
  } else if (equalsLong(other, get_MIN_VALUE())) {
    return isOdd(_this__u8e3s4) ? get_MIN_VALUE() : get_ZERO();
  }
  if (isNegative(_this__u8e3s4)) {
    var tmp;
    if (isNegative(other)) {
      tmp = multiply(negate(_this__u8e3s4), negate(other));
    } else {
      tmp = negate(multiply(negate(_this__u8e3s4), other));
    }
    return tmp;
  } else if (isNegative(other)) {
    return negate(multiply(_this__u8e3s4, negate(other)));
  }
  if (lessThan(_this__u8e3s4, get_TWO_PWR_24_()) && lessThan(other, get_TWO_PWR_24_())) {
    return fromNumber(toNumber(_this__u8e3s4) * toNumber(other));
  }
  var a48 = _this__u8e3s4.high_1 >>> 16 | 0;
  var a32 = _this__u8e3s4.high_1 & 65535;
  var a16 = _this__u8e3s4.low_1 >>> 16 | 0;
  var a00 = _this__u8e3s4.low_1 & 65535;
  var b48 = other.high_1 >>> 16 | 0;
  var b32 = other.high_1 & 65535;
  var b16 = other.low_1 >>> 16 | 0;
  var b00 = other.low_1 & 65535;
  var c48 = 0;
  var c32 = 0;
  var c16 = 0;
  var c00 = 0;
  c00 = c00 + imul_0(a00, b00) | 0;
  c16 = c16 + (c00 >>> 16 | 0) | 0;
  c00 = c00 & 65535;
  c16 = c16 + imul_0(a16, b00) | 0;
  c32 = c32 + (c16 >>> 16 | 0) | 0;
  c16 = c16 & 65535;
  c16 = c16 + imul_0(a00, b16) | 0;
  c32 = c32 + (c16 >>> 16 | 0) | 0;
  c16 = c16 & 65535;
  c32 = c32 + imul_0(a32, b00) | 0;
  c48 = c48 + (c32 >>> 16 | 0) | 0;
  c32 = c32 & 65535;
  c32 = c32 + imul_0(a16, b16) | 0;
  c48 = c48 + (c32 >>> 16 | 0) | 0;
  c32 = c32 & 65535;
  c32 = c32 + imul_0(a00, b32) | 0;
  c48 = c48 + (c32 >>> 16 | 0) | 0;
  c32 = c32 & 65535;
  c48 = c48 + (((imul_0(a48, b00) + imul_0(a32, b16) | 0) + imul_0(a16, b32) | 0) + imul_0(a00, b48) | 0) | 0;
  c48 = c48 & 65535;
  return new Long(c16 << 16 | c00, c48 << 16 | c32);
}
function negate(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return add(invert(_this__u8e3s4), new Long(1, 0));
}
function fromNumber(value) {
  _init_properties_boxedLong_kt__v24qrw();
  if (isNaN_0(value)) {
    return get_ZERO();
  } else if (value <= -9.223372036854776E18) {
    return get_MIN_VALUE();
  } else if (value + 1 >= 9.223372036854776E18) {
    return get_MAX_VALUE();
  } else if (value < 0) {
    return negate(fromNumber(-value));
  } else {
    var twoPwr32 = 4.294967296E9;
    // Inline function 'kotlin.js.jsBitwiseOr' call
    var tmp = value % twoPwr32 | 0;
    // Inline function 'kotlin.js.jsBitwiseOr' call
    var tmp$ret$1 = value / twoPwr32 | 0;
    return new Long(tmp, tmp$ret$1);
  }
}
function add(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  var a48 = _this__u8e3s4.high_1 >>> 16 | 0;
  var a32 = _this__u8e3s4.high_1 & 65535;
  var a16 = _this__u8e3s4.low_1 >>> 16 | 0;
  var a00 = _this__u8e3s4.low_1 & 65535;
  var b48 = other.high_1 >>> 16 | 0;
  var b32 = other.high_1 & 65535;
  var b16 = other.low_1 >>> 16 | 0;
  var b00 = other.low_1 & 65535;
  var c48 = 0;
  var c32 = 0;
  var c16 = 0;
  var c00 = 0;
  c00 = c00 + (a00 + b00 | 0) | 0;
  c16 = c16 + (c00 >>> 16 | 0) | 0;
  c00 = c00 & 65535;
  c16 = c16 + (a16 + b16 | 0) | 0;
  c32 = c32 + (c16 >>> 16 | 0) | 0;
  c16 = c16 & 65535;
  c32 = c32 + (a32 + b32 | 0) | 0;
  c48 = c48 + (c32 >>> 16 | 0) | 0;
  c32 = c32 & 65535;
  c48 = c48 + (a48 + b48 | 0) | 0;
  c48 = c48 & 65535;
  return new Long(c16 << 16 | c00, c48 << 16 | c32);
}
function isOdd(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return (_this__u8e3s4.low_1 & 1) === 1;
}
function lessThan(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return compare(_this__u8e3s4, other) < 0;
}
function invert(_this__u8e3s4) {
  _init_properties_boxedLong_kt__v24qrw();
  return new Long(~_this__u8e3s4.low_1, ~_this__u8e3s4.high_1);
}
function divide(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  if (isZero(other)) {
    throw Exception_init_$Create$_0('division by zero');
  } else if (isZero(_this__u8e3s4)) {
    return get_ZERO();
  }
  if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
    if (equalsLong(other, get_ONE()) || equalsLong(other, get_NEG_ONE())) {
      return get_MIN_VALUE();
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return get_ONE();
    } else {
      var halfThis = shiftRight(_this__u8e3s4, 1);
      var approx = shiftLeft(divide(halfThis, other), 1);
      if (equalsLong(approx, get_ZERO())) {
        return isNegative(other) ? get_ONE() : get_NEG_ONE();
      } else {
        var rem = subtract(_this__u8e3s4, multiply(other, approx));
        return add(approx, divide(rem, other));
      }
    }
  } else if (equalsLong(other, get_MIN_VALUE())) {
    return get_ZERO();
  }
  if (isNegative(_this__u8e3s4)) {
    var tmp;
    if (isNegative(other)) {
      tmp = divide(negate(_this__u8e3s4), negate(other));
    } else {
      tmp = negate(divide(negate(_this__u8e3s4), other));
    }
    return tmp;
  } else if (isNegative(other)) {
    return negate(divide(_this__u8e3s4, negate(other)));
  }
  var res = get_ZERO();
  var rem_0 = _this__u8e3s4;
  while (greaterThanOrEqual(rem_0, other)) {
    var approxDouble = toNumber(rem_0) / toNumber(other);
    var approx2 = Math.max(1.0, Math.floor(approxDouble));
    var log2 = Math.ceil(Math.log(approx2) / Math.LN2);
    var delta = log2 <= 48 ? 1.0 : Math.pow(2.0, log2 - 48);
    var approxRes = fromNumber(approx2);
    var approxRem = multiply(approxRes, other);
    while (isNegative(approxRem) || greaterThan(approxRem, rem_0)) {
      approx2 = approx2 - delta;
      approxRes = fromNumber(approx2);
      approxRem = multiply(approxRes, other);
    }
    if (isZero(approxRes)) {
      approxRes = get_ONE();
    }
    res = add(res, approxRes);
    rem_0 = subtract(rem_0, approxRem);
  }
  return res;
}
function shiftRight(_this__u8e3s4, numBits) {
  _init_properties_boxedLong_kt__v24qrw();
  var numBits_0 = numBits & 63;
  if (numBits_0 === 0) {
    return _this__u8e3s4;
  } else {
    if (numBits_0 < 32) {
      return new Long(_this__u8e3s4.low_1 >>> numBits_0 | 0 | _this__u8e3s4.high_1 << (32 - numBits_0 | 0), _this__u8e3s4.high_1 >> numBits_0);
    } else {
      return new Long(_this__u8e3s4.high_1 >> (numBits_0 - 32 | 0), _this__u8e3s4.high_1 >= 0 ? 0 : -1);
    }
  }
}
function shiftLeft(_this__u8e3s4, numBits) {
  _init_properties_boxedLong_kt__v24qrw();
  var numBits_0 = numBits & 63;
  if (numBits_0 === 0) {
    return _this__u8e3s4;
  } else {
    if (numBits_0 < 32) {
      return new Long(_this__u8e3s4.low_1 << numBits_0, _this__u8e3s4.high_1 << numBits_0 | (_this__u8e3s4.low_1 >>> (32 - numBits_0 | 0) | 0));
    } else {
      return new Long(0, _this__u8e3s4.low_1 << (numBits_0 - 32 | 0));
    }
  }
}
function greaterThan(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return compare(_this__u8e3s4, other) > 0;
}
function greaterThanOrEqual(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return compare(_this__u8e3s4, other) >= 0;
}
function modulo(_this__u8e3s4, other) {
  _init_properties_boxedLong_kt__v24qrw();
  return subtract(_this__u8e3s4, multiply(divide(_this__u8e3s4, other), other));
}
function numberToLong(a) {
  _init_properties_boxedLong_kt__v24qrw();
  var tmp;
  if (a instanceof Long) {
    tmp = a;
  } else {
    tmp = fromNumber(a);
  }
  return tmp;
}
function isLongArray(a) {
  _init_properties_boxedLong_kt__v24qrw();
  return isJsArray(a) && a.$type$ === 'LongArray';
}
function longArrayClass$lambda(it) {
  _init_properties_boxedLong_kt__v24qrw();
  return !(it == null) ? isLongArray(it) : false;
}
var properties_initialized_boxedLong_kt_lfwt2;
function _init_properties_boxedLong_kt__v24qrw() {
  if (!properties_initialized_boxedLong_kt_lfwt2) {
    properties_initialized_boxedLong_kt_lfwt2 = true;
    ZERO = fromInt(0);
    ONE = fromInt(1);
    NEG_ONE = fromInt(-1);
    MAX_VALUE = new Long(-1, 2147483647);
    MIN_VALUE = new Long(0, -2147483648);
    TWO_PWR_24_ = fromInt(16777216);
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp = Array;
    longArrayClass = new PrimitiveKClassImpl(tmp, 'LongArray', longArrayClass$lambda);
  }
}
function charSequenceGet(a, index) {
  var tmp;
  if (isString(a)) {
    tmp = charCodeAt(a, index);
  } else {
    tmp = a.get_kdzpvg_k$(index);
  }
  return tmp;
}
function isString(a) {
  return typeof a === 'string';
}
function charCodeAt(_this__u8e3s4, index) {
  // Inline function 'kotlin.js.asDynamic' call
  return _this__u8e3s4.charCodeAt(index);
}
function charSequenceLength(a) {
  var tmp;
  if (isString(a)) {
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    tmp = a.length;
  } else {
    tmp = a.get_length_g42xv3_k$();
  }
  return tmp;
}
function charSequenceSubSequence(a, startIndex, endIndex) {
  var tmp;
  if (isString(a)) {
    tmp = substring(a, startIndex, endIndex);
  } else {
    tmp = a.subSequence_hm5hnj_k$(startIndex, endIndex);
  }
  return tmp;
}
function arrayToString(array) {
  return joinToString(array, ', ', '[', ']', VOID, VOID, arrayToString$lambda);
}
function arrayToString$lambda(it) {
  return toString_1(it);
}
function compareTo(a, b) {
  var tmp;
  switch (typeof a) {
    case 'number':
      var tmp_0;
      if (typeof b === 'number') {
        tmp_0 = doubleCompareTo(a, b);
      } else {
        if (b instanceof Long) {
          tmp_0 = doubleCompareTo(a, toNumber(b));
        } else {
          tmp_0 = primitiveCompareTo(a, b);
        }
      }

      tmp = tmp_0;
      break;
    case 'string':
    case 'boolean':
    case 'bigint':
      tmp = primitiveCompareTo(a, b);
      break;
    default:
      tmp = compareToDoNotIntrinsicify(a, b);
      break;
  }
  return tmp;
}
function doubleCompareTo(a, b) {
  var tmp;
  if (a < b) {
    tmp = -1;
  } else if (a > b) {
    tmp = 1;
  } else if (a === b) {
    var tmp_0;
    if (a !== 0) {
      tmp_0 = 0;
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      var ia = 1 / a;
      var tmp_1;
      // Inline function 'kotlin.js.asDynamic' call
      if (ia === 1 / b) {
        tmp_1 = 0;
      } else {
        if (ia < 0) {
          tmp_1 = -1;
        } else {
          tmp_1 = 1;
        }
      }
      tmp_0 = tmp_1;
    }
    tmp = tmp_0;
  } else if (a !== a) {
    tmp = b !== b ? 0 : 1;
  } else {
    tmp = -1;
  }
  return tmp;
}
function primitiveCompareTo(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function compareToDoNotIntrinsicify(a, b) {
  return a.compareTo_hpufkf_k$(b);
}
function objectCreate(proto) {
  proto = proto === VOID ? null : proto;
  return Object.create(proto);
}
function defineProp(obj, name, getter, setter, enumerable) {
  return Object.defineProperty(obj, name, {configurable: true, get: getter, set: setter, enumerable: enumerable});
}
function toString_1(o) {
  var tmp;
  if (o == null) {
    tmp = 'null';
  } else if (isArrayish(o)) {
    tmp = '[...]';
  } else if (!(typeof o.toString === 'function')) {
    tmp = anyToString(o);
  } else {
    // Inline function 'kotlin.js.unsafeCast' call
    tmp = o.toString();
  }
  return tmp;
}
function anyToString(o) {
  return Object.prototype.toString.call(o);
}
function unboxIntrinsic(x) {
  // Inline function 'kotlin.error' call
  var message = 'Should be lowered';
  throw IllegalStateException_init_$Create$_0(toString_1(message));
}
function captureStack(instance, constructorFunction) {
  if (Error.captureStackTrace != null) {
    Error.captureStackTrace(instance, constructorFunction);
  } else {
    // Inline function 'kotlin.js.asDynamic' call
    instance.stack = (new Error()).stack;
  }
}
function protoOf(constructor) {
  return constructor.prototype;
}
function defineMessage(message, cause) {
  var tmp;
  if (isUndefined(message)) {
    var tmp_0;
    if (isUndefined(cause)) {
      tmp_0 = message;
    } else {
      var tmp1_elvis_lhs = cause == null ? null : cause.toString();
      tmp_0 = tmp1_elvis_lhs == null ? VOID : tmp1_elvis_lhs;
    }
    tmp = tmp_0;
  } else {
    tmp = message == null ? VOID : message;
  }
  return tmp;
}
function isUndefined(value) {
  return value === VOID;
}
function extendThrowable(this_, message, cause) {
  defineFieldOnInstance(this_, 'message', defineMessage(message, cause));
  defineFieldOnInstance(this_, 'cause', cause);
  defineFieldOnInstance(this_, 'name', Object.getPrototypeOf(this_).constructor.name);
}
function defineFieldOnInstance(this_, name, value) {
  Object.defineProperty(this_, name, {configurable: true, writable: true, value: value});
}
function THROW_CCE() {
  throw ClassCastException_init_$Create$();
}
function jsGenerateInterfaceSymbol() {
  return generateInterfaceSymbolById();
}
function createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
  var undef = VOID;
  return {kind: kind, simpleName: name, associatedObjectKey: associatedObjectKey, associatedObjects: associatedObjects, suspendArity: suspendArity, $kClass$: undef, defaultConstructor: defaultConstructor};
}
function initMetadataForClass(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
  var kind = 'class';
  initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
}
function initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
  if (!(parent == null)) {
    ctor.prototype = Object.create(parent.prototype);
    ctor.prototype.constructor = ctor;
  }
  var metadata = createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity);
  ctor.$metadata$ = metadata;
  var prototype = ctor.prototype;
  if (!(interfaces == null)) {
    var inductionVariable = 0;
    var last = interfaces.length;
    while (inductionVariable < last) {
      var i = interfaces[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      Object.assign(prototype, i.prototype);
      prototype[i.Symbol] = true;
    }
  }
  if (kind === 'interface') {
    ctor.Symbol = generateInterfaceSymbolById();
  }
}
function generateInterfaceSymbolById() {
  return '#__interface_' + generateInterfaceId();
}
function generateInterfaceId() {
  if (globalInterfaceId === VOID) {
    globalInterfaceId = 0;
  }
  // Inline function 'kotlin.js.unsafeCast' call
  globalInterfaceId = globalInterfaceId + 1 | 0;
  return globalInterfaceId;
}
var globalInterfaceId;
function initMetadataForObject(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
  var kind = 'object';
  initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
}
function initMetadataForInterface(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
  var kind = 'interface';
  initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
}
function initMetadataForLambda(ctor, parent, interfaces, suspendArity) {
  initMetadataForClass(ctor, 'Lambda', VOID, parent, interfaces, suspendArity, VOID, VOID);
}
function initMetadataForCoroutine(ctor, parent, interfaces, suspendArity) {
  initMetadataForClass(ctor, 'Coroutine', VOID, parent, interfaces, suspendArity, VOID, VOID);
}
function initMetadataForFunctionReference(ctor, parent, interfaces, suspendArity) {
  initMetadataForClass(ctor, 'FunctionReference', VOID, parent, interfaces, suspendArity, VOID, VOID);
}
function initMetadataForCompanion(ctor, parent, interfaces, suspendArity) {
  initMetadataForObject(ctor, 'Companion', VOID, parent, interfaces, suspendArity, VOID, VOID);
}
function numberToInt(a) {
  var tmp;
  if (a instanceof Long) {
    tmp = convertToInt(a);
  } else {
    tmp = doubleToInt(a);
  }
  return tmp;
}
function doubleToInt(a) {
  var tmp;
  if (a > 2147483647) {
    tmp = 2147483647;
  } else if (a < -2147483648) {
    tmp = -2147483648;
  } else {
    // Inline function 'kotlin.js.jsBitwiseOr' call
    tmp = a | 0;
  }
  return tmp;
}
function numberRangeToNumber(start, endInclusive) {
  return new IntRange(start, endInclusive);
}
function isArrayish(o) {
  return isJsArray(o) || isView(o);
}
function isJsArray(obj) {
  // Inline function 'kotlin.js.unsafeCast' call
  return Array.isArray(obj);
}
function isInterface(obj, iface) {
  return obj[iface.Symbol] === true;
}
function isCharSequence(value) {
  return typeof value === 'string' || isInterface(value, CharSequence);
}
function get_VOID() {
  _init_properties_void_kt__3zg9as();
  return VOID;
}
var VOID;
var properties_initialized_void_kt_e4ret2;
function _init_properties_void_kt__3zg9as() {
  if (!properties_initialized_void_kt_e4ret2) {
    properties_initialized_void_kt_e4ret2 = true;
    VOID = void 0;
  }
}
function digitToIntImpl(_this__u8e3s4) {
  // Inline function 'kotlin.code' call
  var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
  var index = binarySearchRange(Digit_getInstance().rangeStart_1, ch);
  var diff = ch - Digit_getInstance().rangeStart_1[index] | 0;
  return diff < 10 ? diff : -1;
}
function binarySearchRange(array, needle) {
  var bottom = 0;
  var top = array.length - 1 | 0;
  var middle = -1;
  var value = 0;
  while (bottom <= top) {
    middle = (bottom + top | 0) / 2 | 0;
    value = array[middle];
    if (needle > value)
      bottom = middle + 1 | 0;
    else if (needle === value)
      return middle;
    else
      top = middle - 1 | 0;
  }
  return middle - (needle < value ? 1 : 0) | 0;
}
function Digit() {
  Digit_instance = this;
  var tmp = this;
  // Inline function 'kotlin.intArrayOf' call
  tmp.rangeStart_1 = new Int32Array([48, 1632, 1776, 1984, 2406, 2534, 2662, 2790, 2918, 3046, 3174, 3302, 3430, 3558, 3664, 3792, 3872, 4160, 4240, 6112, 6160, 6470, 6608, 6784, 6800, 6992, 7088, 7232, 7248, 42528, 43216, 43264, 43472, 43504, 43600, 44016, 65296]);
}
var Digit_instance;
function Digit_getInstance() {
  if (Digit_instance == null)
    new Digit();
  return Digit_instance;
}
function isWhitespaceImpl(_this__u8e3s4) {
  // Inline function 'kotlin.code' call
  var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
  return (9 <= ch ? ch <= 13 : false) || (28 <= ch ? ch <= 32 : false) || ch === 160 || (ch > 4096 && (ch === 5760 || (8192 <= ch ? ch <= 8202 : false) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288));
}
function isNaN_0(_this__u8e3s4) {
  return !(_this__u8e3s4 === _this__u8e3s4);
}
function Unit() {
}
protoOf(Unit).toString = function () {
  return 'kotlin.Unit';
};
var Unit_instance;
function Unit_getInstance() {
  return Unit_instance;
}
function collectionToArray(collection) {
  return collectionToArrayCommonImpl(collection);
}
function listOf(element) {
  // Inline function 'kotlin.arrayOf' call
  // Inline function 'kotlin.js.unsafeCast' call
  // Inline function 'kotlin.js.asDynamic' call
  var tmp$ret$0 = [element];
  return new ArrayList(tmp$ret$0);
}
function AbstractMutableCollection() {
  AbstractCollection.call(this);
}
protoOf(AbstractMutableCollection).toJSON = function () {
  return this.toArray();
};
protoOf(AbstractMutableCollection).checkIsMutable_jn1ih0_k$ = function () {
};
function IteratorImpl($outer) {
  this.$this_1 = $outer;
  this.index_1 = 0;
  this.last_1 = -1;
}
protoOf(IteratorImpl).hasNext_bitz1p_k$ = function () {
  return this.index_1 < this.$this_1.get_size_woubt6_k$();
};
protoOf(IteratorImpl).next_20eer_k$ = function () {
  if (!this.hasNext_bitz1p_k$())
    throw NoSuchElementException_init_$Create$();
  var tmp = this;
  var _unary__edvuaz = this.index_1;
  this.index_1 = _unary__edvuaz + 1 | 0;
  tmp.last_1 = _unary__edvuaz;
  return this.$this_1.get_c1px32_k$(this.last_1);
};
function AbstractMutableList() {
  AbstractMutableCollection.call(this);
  this.modCount_1 = 0;
}
protoOf(AbstractMutableList).add_utx5q5_k$ = function (element) {
  this.checkIsMutable_jn1ih0_k$();
  this.add_dl6gt3_k$(this.get_size_woubt6_k$(), element);
  return true;
};
protoOf(AbstractMutableList).iterator_jk1svi_k$ = function () {
  return new IteratorImpl(this);
};
function Companion_1() {
  Companion_instance_1 = this;
  var tmp = this;
  // Inline function 'kotlin.also' call
  var this_0 = ArrayList_init_$Create$_0(0);
  this_0.isReadOnly_1 = true;
  tmp.Empty_1 = this_0;
}
var Companion_instance_1;
function Companion_getInstance_1() {
  if (Companion_instance_1 == null)
    new Companion_1();
  return Companion_instance_1;
}
function ArrayList_init_$Init$($this) {
  // Inline function 'kotlin.emptyArray' call
  var tmp$ret$0 = [];
  ArrayList.call($this, tmp$ret$0);
  return $this;
}
function ArrayList_init_$Create$() {
  return ArrayList_init_$Init$(objectCreate(protoOf(ArrayList)));
}
function ArrayList_init_$Init$_0(initialCapacity, $this) {
  // Inline function 'kotlin.emptyArray' call
  var tmp$ret$0 = [];
  ArrayList.call($this, tmp$ret$0);
  // Inline function 'kotlin.require' call
  if (!(initialCapacity >= 0)) {
    var message = 'Negative initial capacity: ' + initialCapacity;
    throw IllegalArgumentException_init_$Create$_0(toString_1(message));
  }
  return $this;
}
function ArrayList_init_$Create$_0(initialCapacity) {
  return ArrayList_init_$Init$_0(initialCapacity, objectCreate(protoOf(ArrayList)));
}
function rangeCheck($this, index) {
  // Inline function 'kotlin.apply' call
  Companion_instance_2.checkElementIndex_s0yg86_k$(index, $this.get_size_woubt6_k$());
  return index;
}
function insertionRangeCheck($this, index) {
  // Inline function 'kotlin.apply' call
  Companion_instance_2.checkPositionIndex_w4k0on_k$(index, $this.get_size_woubt6_k$());
  return index;
}
function ArrayList(array) {
  Companion_getInstance_1();
  AbstractMutableList.call(this);
  this.array_1 = array;
  this.isReadOnly_1 = false;
}
protoOf(ArrayList).get_size_woubt6_k$ = function () {
  return this.array_1.length;
};
protoOf(ArrayList).get_c1px32_k$ = function (index) {
  return this.array_1[rangeCheck(this, index)];
};
protoOf(ArrayList).add_utx5q5_k$ = function (element) {
  this.checkIsMutable_jn1ih0_k$();
  // Inline function 'kotlin.js.asDynamic' call
  this.array_1.push(element);
  this.modCount_1 = this.modCount_1 + 1 | 0;
  return true;
};
protoOf(ArrayList).add_dl6gt3_k$ = function (index, element) {
  this.checkIsMutable_jn1ih0_k$();
  // Inline function 'kotlin.js.asDynamic' call
  this.array_1.splice(insertionRangeCheck(this, index), 0, element);
  this.modCount_1 = this.modCount_1 + 1 | 0;
};
protoOf(ArrayList).toString = function () {
  return arrayToString(this.array_1);
};
protoOf(ArrayList).toArray_jjyjqa_k$ = function () {
  return [].slice.call(this.array_1);
};
protoOf(ArrayList).toArray = function () {
  return this.toArray_jjyjqa_k$();
};
protoOf(ArrayList).checkIsMutable_jn1ih0_k$ = function () {
  if (this.isReadOnly_1)
    throw UnsupportedOperationException_init_$Create$();
};
function UnsupportedOperationException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  UnsupportedOperationException.call($this);
  return $this;
}
function UnsupportedOperationException_init_$Create$() {
  var tmp = UnsupportedOperationException_init_$Init$(objectCreate(protoOf(UnsupportedOperationException)));
  captureStack(tmp, UnsupportedOperationException_init_$Create$);
  return tmp;
}
function UnsupportedOperationException() {
  captureStack(this, UnsupportedOperationException);
}
function IllegalArgumentException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  IllegalArgumentException.call($this);
  return $this;
}
function IllegalArgumentException_init_$Create$() {
  var tmp = IllegalArgumentException_init_$Init$(objectCreate(protoOf(IllegalArgumentException)));
  captureStack(tmp, IllegalArgumentException_init_$Create$);
  return tmp;
}
function IllegalArgumentException_init_$Init$_0(message, $this) {
  RuntimeException_init_$Init$_0(message, $this);
  IllegalArgumentException.call($this);
  return $this;
}
function IllegalArgumentException_init_$Create$_0(message) {
  var tmp = IllegalArgumentException_init_$Init$_0(message, objectCreate(protoOf(IllegalArgumentException)));
  captureStack(tmp, IllegalArgumentException_init_$Create$_0);
  return tmp;
}
function IllegalArgumentException() {
  captureStack(this, IllegalArgumentException);
}
function RuntimeException_init_$Init$($this) {
  Exception_init_$Init$($this);
  RuntimeException.call($this);
  return $this;
}
function RuntimeException_init_$Create$() {
  var tmp = RuntimeException_init_$Init$(objectCreate(protoOf(RuntimeException)));
  captureStack(tmp, RuntimeException_init_$Create$);
  return tmp;
}
function RuntimeException_init_$Init$_0(message, $this) {
  Exception_init_$Init$_0(message, $this);
  RuntimeException.call($this);
  return $this;
}
function RuntimeException() {
  captureStack(this, RuntimeException);
}
function Exception_init_$Init$($this) {
  extendThrowable($this);
  Exception.call($this);
  return $this;
}
function Exception_init_$Create$() {
  var tmp = Exception_init_$Init$(objectCreate(protoOf(Exception)));
  captureStack(tmp, Exception_init_$Create$);
  return tmp;
}
function Exception_init_$Init$_0(message, $this) {
  extendThrowable($this, message);
  Exception.call($this);
  return $this;
}
function Exception_init_$Create$_0(message) {
  var tmp = Exception_init_$Init$_0(message, objectCreate(protoOf(Exception)));
  captureStack(tmp, Exception_init_$Create$_0);
  return tmp;
}
function Exception() {
  captureStack(this, Exception);
}
function NoSuchElementException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  NoSuchElementException.call($this);
  return $this;
}
function NoSuchElementException_init_$Create$() {
  var tmp = NoSuchElementException_init_$Init$(objectCreate(protoOf(NoSuchElementException)));
  captureStack(tmp, NoSuchElementException_init_$Create$);
  return tmp;
}
function NoSuchElementException_init_$Init$_0(message, $this) {
  RuntimeException_init_$Init$_0(message, $this);
  NoSuchElementException.call($this);
  return $this;
}
function NoSuchElementException_init_$Create$_0(message) {
  var tmp = NoSuchElementException_init_$Init$_0(message, objectCreate(protoOf(NoSuchElementException)));
  captureStack(tmp, NoSuchElementException_init_$Create$_0);
  return tmp;
}
function NoSuchElementException() {
  captureStack(this, NoSuchElementException);
}
function IndexOutOfBoundsException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  IndexOutOfBoundsException.call($this);
  return $this;
}
function IndexOutOfBoundsException_init_$Create$() {
  var tmp = IndexOutOfBoundsException_init_$Init$(objectCreate(protoOf(IndexOutOfBoundsException)));
  captureStack(tmp, IndexOutOfBoundsException_init_$Create$);
  return tmp;
}
function IndexOutOfBoundsException_init_$Init$_0(message, $this) {
  RuntimeException_init_$Init$_0(message, $this);
  IndexOutOfBoundsException.call($this);
  return $this;
}
function IndexOutOfBoundsException_init_$Create$_0(message) {
  var tmp = IndexOutOfBoundsException_init_$Init$_0(message, objectCreate(protoOf(IndexOutOfBoundsException)));
  captureStack(tmp, IndexOutOfBoundsException_init_$Create$_0);
  return tmp;
}
function IndexOutOfBoundsException() {
  captureStack(this, IndexOutOfBoundsException);
}
function IllegalStateException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  IllegalStateException.call($this);
  return $this;
}
function IllegalStateException_init_$Create$() {
  var tmp = IllegalStateException_init_$Init$(objectCreate(protoOf(IllegalStateException)));
  captureStack(tmp, IllegalStateException_init_$Create$);
  return tmp;
}
function IllegalStateException_init_$Init$_0(message, $this) {
  RuntimeException_init_$Init$_0(message, $this);
  IllegalStateException.call($this);
  return $this;
}
function IllegalStateException_init_$Create$_0(message) {
  var tmp = IllegalStateException_init_$Init$_0(message, objectCreate(protoOf(IllegalStateException)));
  captureStack(tmp, IllegalStateException_init_$Create$_0);
  return tmp;
}
function IllegalStateException() {
  captureStack(this, IllegalStateException);
}
function NumberFormatException_init_$Init$($this) {
  IllegalArgumentException_init_$Init$($this);
  NumberFormatException.call($this);
  return $this;
}
function NumberFormatException_init_$Create$() {
  var tmp = NumberFormatException_init_$Init$(objectCreate(protoOf(NumberFormatException)));
  captureStack(tmp, NumberFormatException_init_$Create$);
  return tmp;
}
function NumberFormatException_init_$Init$_0(message, $this) {
  IllegalArgumentException_init_$Init$_0(message, $this);
  NumberFormatException.call($this);
  return $this;
}
function NumberFormatException_init_$Create$_0(message) {
  var tmp = NumberFormatException_init_$Init$_0(message, objectCreate(protoOf(NumberFormatException)));
  captureStack(tmp, NumberFormatException_init_$Create$_0);
  return tmp;
}
function NumberFormatException() {
  captureStack(this, NumberFormatException);
}
function ClassCastException_init_$Init$($this) {
  RuntimeException_init_$Init$($this);
  ClassCastException.call($this);
  return $this;
}
function ClassCastException_init_$Create$() {
  var tmp = ClassCastException_init_$Init$(objectCreate(protoOf(ClassCastException)));
  captureStack(tmp, ClassCastException_init_$Create$);
  return tmp;
}
function ClassCastException() {
  captureStack(this, ClassCastException);
}
function abs(n) {
  return compare(n, new Long(0, 0)) < 0 ? negate(n) : n;
}
function roundToInt(_this__u8e3s4) {
  var tmp;
  if (isNaN_0(_this__u8e3s4)) {
    throw IllegalArgumentException_init_$Create$_0('Cannot round NaN value.');
  } else if (_this__u8e3s4 > 2147483647) {
    tmp = 2147483647;
  } else if (_this__u8e3s4 < -2147483648) {
    tmp = -2147483648;
  } else {
    tmp = numberToInt(Math.round(_this__u8e3s4));
  }
  return tmp;
}
function PrimitiveKClassImpl(jClass, simpleName, isInstanceFunction) {
  KClassImpl.call(this);
  this.jClass_1 = jClass;
  this.simpleName_1 = simpleName;
  this.isInstanceFunction_1 = isInstanceFunction;
}
protoOf(PrimitiveKClassImpl).get_simpleName_r6f8py_k$ = function () {
  return this.simpleName_1;
};
function KClassImpl() {
}
protoOf(KClassImpl).toString = function () {
  return 'class ' + this.get_simpleName_r6f8py_k$();
};
function StringBuilder_init_$Init$(capacity, $this) {
  StringBuilder_init_$Init$_0($this);
  return $this;
}
function StringBuilder_init_$Create$(capacity) {
  return StringBuilder_init_$Init$(capacity, objectCreate(protoOf(StringBuilder)));
}
function StringBuilder_init_$Init$_0($this) {
  StringBuilder.call($this, '');
  return $this;
}
function StringBuilder_init_$Create$_0() {
  return StringBuilder_init_$Init$_0(objectCreate(protoOf(StringBuilder)));
}
function StringBuilder(content) {
  this.string_1 = content;
}
protoOf(StringBuilder).get_length_g42xv3_k$ = function () {
  // Inline function 'kotlin.js.asDynamic' call
  return this.string_1.length;
};
protoOf(StringBuilder).get_kdzpvg_k$ = function (index) {
  // Inline function 'kotlin.text.getOrElse' call
  var this_0 = this.string_1;
  var tmp;
  if (0 <= index ? index <= (charSequenceLength(this_0) - 1 | 0) : false) {
    tmp = charSequenceGet(this_0, index);
  } else {
    throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', length: ' + this.get_length_g42xv3_k$() + '}');
  }
  return tmp;
};
protoOf(StringBuilder).subSequence_hm5hnj_k$ = function (startIndex, endIndex) {
  return substring(this.string_1, startIndex, endIndex);
};
protoOf(StringBuilder).append_t84oo1_k$ = function (value) {
  this.string_1 = this.string_1 + toString(value);
  return this;
};
protoOf(StringBuilder).append_jgojdo_k$ = function (value) {
  this.string_1 = this.string_1 + toString_0(value);
  return this;
};
protoOf(StringBuilder).toString = function () {
  return this.string_1;
};
function uppercaseChar(_this__u8e3s4) {
  // Inline function 'kotlin.text.uppercase' call
  // Inline function 'kotlin.js.asDynamic' call
  // Inline function 'kotlin.js.unsafeCast' call
  var uppercase = toString(_this__u8e3s4).toUpperCase();
  return uppercase.length > 1 ? _this__u8e3s4 : charCodeAt(uppercase, 0);
}
function isWhitespace(_this__u8e3s4) {
  return isWhitespaceImpl(_this__u8e3s4);
}
function checkRadix(radix) {
  if (!(2 <= radix ? radix <= 36 : false)) {
    throw IllegalArgumentException_init_$Create$_0('radix ' + radix + ' was not in valid range 2..36');
  }
  return radix;
}
function toLong(_this__u8e3s4) {
  var tmp0_elvis_lhs = toLongOrNull(_this__u8e3s4);
  var tmp;
  if (tmp0_elvis_lhs == null) {
    numberFormatError(_this__u8e3s4);
  } else {
    tmp = tmp0_elvis_lhs;
  }
  return tmp;
}
function digitOf(char, radix) {
  // Inline function 'kotlin.let' call
  var it = Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(48)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(57)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(48)) : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(90)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(97)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(122)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(97)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(128)) < 0 ? -1 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65313)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65338)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65313)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65345)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65370)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65345)) + 10 | 0 : digitToIntImpl(char);
  return it >= radix ? -1 : it;
}
var STRING_CASE_INSENSITIVE_ORDER;
function substring(_this__u8e3s4, startIndex, endIndex) {
  _init_properties_stringJs_kt__bg7zye();
  // Inline function 'kotlin.js.asDynamic' call
  return _this__u8e3s4.substring(startIndex, endIndex);
}
function compareTo_0(_this__u8e3s4, other, ignoreCase) {
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  _init_properties_stringJs_kt__bg7zye();
  if (ignoreCase) {
    var n1 = _this__u8e3s4.length;
    var n2 = other.length;
    // Inline function 'kotlin.comparisons.minOf' call
    var min = Math.min(n1, n2);
    if (min === 0)
      return n1 - n2 | 0;
    var inductionVariable = 0;
    if (inductionVariable < min)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var thisChar = charCodeAt(_this__u8e3s4, index);
        var otherChar = charCodeAt(other, index);
        if (!(thisChar === otherChar)) {
          thisChar = uppercaseChar(thisChar);
          otherChar = uppercaseChar(otherChar);
          if (!(thisChar === otherChar)) {
            // Inline function 'kotlin.text.lowercaseChar' call
            // Inline function 'kotlin.text.lowercase' call
            var this_0 = thisChar;
            // Inline function 'kotlin.js.asDynamic' call
            // Inline function 'kotlin.js.unsafeCast' call
            var tmp$ret$2 = toString(this_0).toLowerCase();
            thisChar = charCodeAt(tmp$ret$2, 0);
            // Inline function 'kotlin.text.lowercaseChar' call
            // Inline function 'kotlin.text.lowercase' call
            var this_1 = otherChar;
            // Inline function 'kotlin.js.asDynamic' call
            // Inline function 'kotlin.js.unsafeCast' call
            var tmp$ret$6 = toString(this_1).toLowerCase();
            otherChar = charCodeAt(tmp$ret$6, 0);
            if (!(thisChar === otherChar)) {
              return Char__compareTo_impl_ypi4mb(thisChar, otherChar);
            }
          }
        }
      }
       while (inductionVariable < min);
    return n1 - n2 | 0;
  } else {
    return compareTo(_this__u8e3s4, other);
  }
}
function sam$kotlin_Comparator$0(function_0) {
  this.function_1 = function_0;
}
protoOf(sam$kotlin_Comparator$0).compare_bczr_k$ = function (a, b) {
  return this.function_1(a, b);
};
protoOf(sam$kotlin_Comparator$0).compare = function (a, b) {
  return this.compare_bczr_k$(a, b);
};
function STRING_CASE_INSENSITIVE_ORDER$lambda(a, b) {
  _init_properties_stringJs_kt__bg7zye();
  return compareTo_0(a, b, true);
}
var properties_initialized_stringJs_kt_nta8o4;
function _init_properties_stringJs_kt__bg7zye() {
  if (!properties_initialized_stringJs_kt_nta8o4) {
    properties_initialized_stringJs_kt_nta8o4 = true;
    var tmp = STRING_CASE_INSENSITIVE_ORDER$lambda;
    STRING_CASE_INSENSITIVE_ORDER = new sam$kotlin_Comparator$0(tmp);
  }
}
function regionMatches(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase) {
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  return regionMatchesImpl(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase);
}
function AbstractCollection$toString$lambda(this$0) {
  return function (it) {
    return it === this$0 ? '(this Collection)' : toString_0(it);
  };
}
function AbstractCollection() {
}
protoOf(AbstractCollection).isEmpty_y1axqb_k$ = function () {
  return this.get_size_woubt6_k$() === 0;
};
protoOf(AbstractCollection).toString = function () {
  return joinToString_0(this, ', ', '[', ']', VOID, VOID, AbstractCollection$toString$lambda(this));
};
protoOf(AbstractCollection).toArray = function () {
  return collectionToArray(this);
};
function Companion_2() {
  this.maxArraySize_1 = 2147483639;
}
protoOf(Companion_2).checkElementIndex_s0yg86_k$ = function (index, size) {
  if (index < 0 || index >= size) {
    throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
  }
};
protoOf(Companion_2).checkPositionIndex_w4k0on_k$ = function (index, size) {
  if (index < 0 || index > size) {
    throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
  }
};
var Companion_instance_2;
function Companion_getInstance_2() {
  return Companion_instance_2;
}
function collectionToArrayCommonImpl(collection) {
  if (collection.isEmpty_y1axqb_k$()) {
    // Inline function 'kotlin.emptyArray' call
    return [];
  }
  // Inline function 'kotlin.arrayOfNulls' call
  var size = collection.get_size_woubt6_k$();
  var destination = Array(size);
  var iterator = collection.iterator_jk1svi_k$();
  var index = 0;
  while (iterator.hasNext_bitz1p_k$()) {
    var _unary__edvuaz = index;
    index = _unary__edvuaz + 1 | 0;
    destination[_unary__edvuaz] = iterator.next_20eer_k$();
  }
  return destination;
}
function collectionSizeOrDefault(_this__u8e3s4, default_0) {
  var tmp;
  if (isInterface(_this__u8e3s4, Collection)) {
    tmp = _this__u8e3s4.get_size_woubt6_k$();
  } else {
    tmp = default_0;
  }
  return tmp;
}
function IntIterator() {
}
protoOf(IntIterator).next_20eer_k$ = function () {
  return this.nextInt_ujorgc_k$();
};
function getProgressionLastElement(start, end, step) {
  var tmp;
  if (step > 0) {
    tmp = start >= end ? end : end - differenceModulo(end, start, step) | 0;
  } else if (step < 0) {
    tmp = start <= end ? end : end + differenceModulo(start, end, -step | 0) | 0;
  } else {
    throw IllegalArgumentException_init_$Create$_0('Step is zero.');
  }
  return tmp;
}
function differenceModulo(a, b, c) {
  return mod(mod(a, c) - mod(b, c) | 0, c);
}
function mod(a, b) {
  var mod = a % b | 0;
  return mod >= 0 ? mod : mod + b | 0;
}
function Companion_3() {
  Companion_instance_3 = this;
  this.EMPTY_1 = new IntRange(1, 0);
}
var Companion_instance_3;
function Companion_getInstance_3() {
  if (Companion_instance_3 == null) {
    Companion_instance_4;
    new Companion_3();
  }
  return Companion_instance_3;
}
function IntRange(start, endInclusive) {
  Companion_getInstance_3();
  IntProgression.call(this, start, endInclusive, 1);
}
protoOf(IntRange).get_start_iypx6h_k$ = function () {
  return this.first_1;
};
protoOf(IntRange).get_endInclusive_r07xpi_k$ = function () {
  return this.last_1;
};
protoOf(IntRange).toString = function () {
  return '' + this.first_1 + '..' + this.last_1;
};
function IntProgressionIterator(first, last, step) {
  IntIterator.call(this);
  this.step_1 = step;
  this.finalElement_1 = last;
  this.hasNext_1 = this.step_1 > 0 ? first <= last : first >= last;
  this.next_1 = this.hasNext_1 ? first : this.finalElement_1;
}
protoOf(IntProgressionIterator).hasNext_bitz1p_k$ = function () {
  return this.hasNext_1;
};
protoOf(IntProgressionIterator).nextInt_ujorgc_k$ = function () {
  var value = this.next_1;
  if (value === this.finalElement_1) {
    if (!this.hasNext_1)
      throw NoSuchElementException_init_$Create$();
    this.hasNext_1 = false;
  } else {
    this.next_1 = this.next_1 + this.step_1 | 0;
  }
  return value;
};
function Companion_4() {
}
protoOf(Companion_4).fromClosedRange_y6bqsv_k$ = function (rangeStart, rangeEnd, step) {
  return new IntProgression(rangeStart, rangeEnd, step);
};
var Companion_instance_4;
function Companion_getInstance_4() {
  return Companion_instance_4;
}
function IntProgression(start, endInclusive, step) {
  if (step === 0)
    throw IllegalArgumentException_init_$Create$_0('Step must be non-zero.');
  if (step === -2147483648)
    throw IllegalArgumentException_init_$Create$_0('Step must be greater than Int.MIN_VALUE to avoid overflow on negation.');
  this.first_1 = start;
  this.last_1 = getProgressionLastElement(start, endInclusive, step);
  this.step_1 = step;
}
protoOf(IntProgression).iterator_jk1svi_k$ = function () {
  return new IntProgressionIterator(this.first_1, this.last_1, this.step_1);
};
protoOf(IntProgression).toString = function () {
  return this.step_1 > 0 ? '' + this.first_1 + '..' + this.last_1 + ' step ' + this.step_1 : '' + this.first_1 + ' downTo ' + this.last_1 + ' step ' + (-this.step_1 | 0);
};
function appendElement(_this__u8e3s4, element, transform) {
  if (!(transform == null))
    _this__u8e3s4.append_jgojdo_k$(transform(element));
  else {
    if (element == null ? true : isCharSequence(element))
      _this__u8e3s4.append_jgojdo_k$(element);
    else {
      if (element instanceof Char)
        _this__u8e3s4.append_t84oo1_k$(element.value_1);
      else {
        _this__u8e3s4.append_jgojdo_k$(toString_1(element));
      }
    }
  }
}
function equals(_this__u8e3s4, other, ignoreCase) {
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  if (_this__u8e3s4 === other)
    return true;
  if (!ignoreCase)
    return false;
  var thisUpper = uppercaseChar(_this__u8e3s4);
  var otherUpper = uppercaseChar(other);
  var tmp;
  if (thisUpper === otherUpper) {
    tmp = true;
  } else {
    // Inline function 'kotlin.text.lowercaseChar' call
    // Inline function 'kotlin.text.lowercase' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$1 = toString(thisUpper).toLowerCase();
    var tmp_0 = charCodeAt(tmp$ret$1, 0);
    // Inline function 'kotlin.text.lowercaseChar' call
    // Inline function 'kotlin.text.lowercase' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$5 = toString(otherUpper).toLowerCase();
    tmp = tmp_0 === charCodeAt(tmp$ret$5, 0);
  }
  return tmp;
}
function toLongOrNull(_this__u8e3s4) {
  return toLongOrNull_0(_this__u8e3s4, 10);
}
function numberFormatError(input) {
  throw NumberFormatException_init_$Create$_0("Invalid number format: '" + input + "'");
}
function toLongOrNull_0(_this__u8e3s4, radix) {
  checkRadix(radix);
  var length = _this__u8e3s4.length;
  if (length === 0)
    return null;
  var start;
  var isNegative;
  var limit;
  var firstChar = charCodeAt(_this__u8e3s4, 0);
  if (Char__compareTo_impl_ypi4mb(firstChar, _Char___init__impl__6a9atx(48)) < 0) {
    if (length === 1)
      return null;
    start = 1;
    if (firstChar === _Char___init__impl__6a9atx(45)) {
      isNegative = true;
      limit = new Long(0, -2147483648);
    } else if (firstChar === _Char___init__impl__6a9atx(43)) {
      isNegative = false;
      limit = new Long(1, -2147483648);
    } else
      return null;
  } else {
    start = 0;
    isNegative = false;
    limit = new Long(1, -2147483648);
  }
  // Inline function 'kotlin.Long.div' call
  var this_0 = new Long(1, -2147483648);
  var limitForMaxRadix = divide(this_0, fromInt(36));
  var limitBeforeMul = limitForMaxRadix;
  var result = new Long(0, 0);
  var inductionVariable = start;
  if (inductionVariable < length)
    do {
      var i = inductionVariable;
      inductionVariable = inductionVariable + 1 | 0;
      var digit = digitOf(charCodeAt(_this__u8e3s4, i), radix);
      if (digit < 0)
        return null;
      if (compare(result, limitBeforeMul) < 0) {
        if (equalsLong(limitBeforeMul, limitForMaxRadix)) {
          // Inline function 'kotlin.Long.div' call
          var this_1 = limit;
          limitBeforeMul = divide(this_1, fromInt(radix));
          if (compare(result, limitBeforeMul) < 0) {
            return null;
          }
        } else {
          return null;
        }
      }
      // Inline function 'kotlin.Long.times' call
      var this_2 = result;
      result = multiply(this_2, fromInt(radix));
      var tmp = result;
      // Inline function 'kotlin.Long.plus' call
      var this_3 = limit;
      var tmp$ret$3 = add(this_3, fromInt(digit));
      if (compare(tmp, tmp$ret$3) < 0)
        return null;
      // Inline function 'kotlin.Long.minus' call
      var this_4 = result;
      result = subtract(this_4, fromInt(digit));
    }
     while (inductionVariable < length);
  return isNegative ? result : negate(result);
}
function padStart(_this__u8e3s4, length, padChar) {
  padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
  return toString_1(padStart_0(isCharSequence(_this__u8e3s4) ? _this__u8e3s4 : THROW_CCE(), length, padChar));
}
function split(_this__u8e3s4, delimiters, ignoreCase, limit) {
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  limit = limit === VOID ? 0 : limit;
  if (delimiters.length === 1) {
    return split_0(_this__u8e3s4, toString(delimiters[0]), ignoreCase, limit);
  }
  // Inline function 'kotlin.collections.map' call
  var this_0 = asIterable(rangesDelimitedBy(_this__u8e3s4, delimiters, VOID, ignoreCase, limit));
  // Inline function 'kotlin.collections.mapTo' call
  var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
  var _iterator__ex2g4s = this_0.iterator_jk1svi_k$();
  while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
    var item = _iterator__ex2g4s.next_20eer_k$();
    var tmp$ret$2 = substring_0(_this__u8e3s4, item);
    destination.add_utx5q5_k$(tmp$ret$2);
  }
  return destination;
}
function padEnd(_this__u8e3s4, length, padChar) {
  padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
  return toString_1(padEnd_0(isCharSequence(_this__u8e3s4) ? _this__u8e3s4 : THROW_CCE(), length, padChar));
}
function padStart_0(_this__u8e3s4, length, padChar) {
  padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
  if (length < 0)
    throw IllegalArgumentException_init_$Create$_0('Desired length ' + length + ' is less than zero.');
  if (length <= charSequenceLength(_this__u8e3s4))
    return charSequenceSubSequence(_this__u8e3s4, 0, charSequenceLength(_this__u8e3s4));
  var sb = StringBuilder_init_$Create$(length);
  var inductionVariable = 1;
  var last = length - charSequenceLength(_this__u8e3s4) | 0;
  if (inductionVariable <= last)
    do {
      var i = inductionVariable;
      inductionVariable = inductionVariable + 1 | 0;
      sb.append_t84oo1_k$(padChar);
    }
     while (!(i === last));
  sb.append_jgojdo_k$(_this__u8e3s4);
  return sb;
}
function trim(_this__u8e3s4) {
  // Inline function 'kotlin.text.trim' call
  var startIndex = 0;
  var endIndex = charSequenceLength(_this__u8e3s4) - 1 | 0;
  var startFound = false;
  $l$loop: while (startIndex <= endIndex) {
    var index = !startFound ? startIndex : endIndex;
    var p0 = charSequenceGet(_this__u8e3s4, index);
    var match = isWhitespace(p0);
    if (!startFound) {
      if (!match)
        startFound = true;
      else
        startIndex = startIndex + 1 | 0;
    } else {
      if (!match)
        break $l$loop;
      else
        endIndex = endIndex - 1 | 0;
    }
  }
  return charSequenceSubSequence(_this__u8e3s4, startIndex, endIndex + 1 | 0);
}
function split_0(_this__u8e3s4, delimiter, ignoreCase, limit) {
  requireNonNegativeLimit(limit);
  var currentOffset = 0;
  var nextIndex = indexOf(_this__u8e3s4, delimiter, currentOffset, ignoreCase);
  if (nextIndex === -1 || limit === 1) {
    return listOf(toString_1(_this__u8e3s4));
  }
  var isLimited = limit > 0;
  var result = ArrayList_init_$Create$_0(isLimited ? coerceAtMost(limit, 10) : 10);
  $l$loop: do {
    var tmp2 = currentOffset;
    // Inline function 'kotlin.text.substring' call
    var endIndex = nextIndex;
    var tmp$ret$0 = toString_1(charSequenceSubSequence(_this__u8e3s4, tmp2, endIndex));
    result.add_utx5q5_k$(tmp$ret$0);
    currentOffset = nextIndex + delimiter.length | 0;
    if (isLimited && result.get_size_woubt6_k$() === (limit - 1 | 0))
      break $l$loop;
    nextIndex = indexOf(_this__u8e3s4, delimiter, currentOffset, ignoreCase);
  }
   while (!(nextIndex === -1));
  var tmp2_0 = currentOffset;
  // Inline function 'kotlin.text.substring' call
  var endIndex_0 = charSequenceLength(_this__u8e3s4);
  var tmp$ret$1 = toString_1(charSequenceSubSequence(_this__u8e3s4, tmp2_0, endIndex_0));
  result.add_utx5q5_k$(tmp$ret$1);
  return result;
}
function rangesDelimitedBy(_this__u8e3s4, delimiters, startIndex, ignoreCase, limit) {
  startIndex = startIndex === VOID ? 0 : startIndex;
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  limit = limit === VOID ? 0 : limit;
  requireNonNegativeLimit(limit);
  return new DelimitedRangesSequence(_this__u8e3s4, startIndex, limit, rangesDelimitedBy$lambda(delimiters, ignoreCase));
}
function substring_0(_this__u8e3s4, range) {
  return toString_1(charSequenceSubSequence(_this__u8e3s4, range.get_start_iypx6h_k$(), range.get_endInclusive_r07xpi_k$() + 1 | 0));
}
function padEnd_0(_this__u8e3s4, length, padChar) {
  padChar = padChar === VOID ? _Char___init__impl__6a9atx(32) : padChar;
  if (length < 0)
    throw IllegalArgumentException_init_$Create$_0('Desired length ' + length + ' is less than zero.');
  if (length <= charSequenceLength(_this__u8e3s4))
    return charSequenceSubSequence(_this__u8e3s4, 0, charSequenceLength(_this__u8e3s4));
  var sb = StringBuilder_init_$Create$(length);
  sb.append_jgojdo_k$(_this__u8e3s4);
  var inductionVariable = 1;
  var last = length - charSequenceLength(_this__u8e3s4) | 0;
  if (inductionVariable <= last)
    do {
      var i = inductionVariable;
      inductionVariable = inductionVariable + 1 | 0;
      sb.append_t84oo1_k$(padChar);
    }
     while (!(i === last));
  return sb;
}
function requireNonNegativeLimit(limit) {
  // Inline function 'kotlin.require' call
  if (!(limit >= 0)) {
    var message = 'Limit must be non-negative, but was ' + limit;
    throw IllegalArgumentException_init_$Create$_0(toString_1(message));
  }
  return Unit_instance;
}
function indexOf(_this__u8e3s4, string, startIndex, ignoreCase) {
  startIndex = startIndex === VOID ? 0 : startIndex;
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  var tmp;
  var tmp_0;
  if (ignoreCase) {
    tmp_0 = true;
  } else {
    tmp_0 = !(typeof _this__u8e3s4 === 'string');
  }
  if (tmp_0) {
    tmp = indexOf_0(_this__u8e3s4, string, startIndex, charSequenceLength(_this__u8e3s4), ignoreCase);
  } else {
    // Inline function 'kotlin.text.nativeIndexOf' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp = _this__u8e3s4.indexOf(string, startIndex);
  }
  return tmp;
}
function calcNext($this) {
  if ($this.nextSearchIndex_1 < 0) {
    $this.nextState_1 = 0;
    $this.nextItem_1 = null;
  } else {
    var tmp;
    var tmp_0;
    if ($this.this$0__1.limit_1 > 0) {
      $this.counter_1 = $this.counter_1 + 1 | 0;
      tmp_0 = $this.counter_1 >= $this.this$0__1.limit_1;
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = true;
    } else {
      tmp = $this.nextSearchIndex_1 > charSequenceLength($this.this$0__1.input_1);
    }
    if (tmp) {
      $this.nextItem_1 = numberRangeToNumber($this.currentStartIndex_1, get_lastIndex($this.this$0__1.input_1));
      $this.nextSearchIndex_1 = -1;
    } else {
      var match = $this.this$0__1.getNextMatch_1($this.this$0__1.input_1, $this.nextSearchIndex_1);
      if (match == null) {
        $this.nextItem_1 = numberRangeToNumber($this.currentStartIndex_1, get_lastIndex($this.this$0__1.input_1));
        $this.nextSearchIndex_1 = -1;
      } else {
        var index = match.component1_7eebsc_k$();
        var length = match.component2_7eebsb_k$();
        $this.nextItem_1 = until($this.currentStartIndex_1, index);
        $this.currentStartIndex_1 = index + length | 0;
        $this.nextSearchIndex_1 = $this.currentStartIndex_1 + (length === 0 ? 1 : 0) | 0;
      }
    }
    $this.nextState_1 = 1;
  }
}
function DelimitedRangesSequence$iterator$1(this$0) {
  this.this$0__1 = this$0;
  this.nextState_1 = -1;
  this.currentStartIndex_1 = coerceIn_0(this$0.startIndex_1, 0, charSequenceLength(this$0.input_1));
  this.nextSearchIndex_1 = this.currentStartIndex_1;
  this.nextItem_1 = null;
  this.counter_1 = 0;
}
protoOf(DelimitedRangesSequence$iterator$1).next_20eer_k$ = function () {
  if (this.nextState_1 === -1) {
    calcNext(this);
  }
  if (this.nextState_1 === 0)
    throw NoSuchElementException_init_$Create$();
  var tmp = this.nextItem_1;
  var result = tmp instanceof IntRange ? tmp : THROW_CCE();
  this.nextItem_1 = null;
  this.nextState_1 = -1;
  return result;
};
protoOf(DelimitedRangesSequence$iterator$1).hasNext_bitz1p_k$ = function () {
  if (this.nextState_1 === -1) {
    calcNext(this);
  }
  return this.nextState_1 === 1;
};
function DelimitedRangesSequence(input, startIndex, limit, getNextMatch) {
  this.input_1 = input;
  this.startIndex_1 = startIndex;
  this.limit_1 = limit;
  this.getNextMatch_1 = getNextMatch;
}
protoOf(DelimitedRangesSequence).iterator_jk1svi_k$ = function () {
  return new DelimitedRangesSequence$iterator$1(this);
};
function indexOfAny(_this__u8e3s4, chars, startIndex, ignoreCase) {
  startIndex = startIndex === VOID ? 0 : startIndex;
  ignoreCase = ignoreCase === VOID ? false : ignoreCase;
  var tmp;
  if (!ignoreCase && chars.length === 1) {
    tmp = typeof _this__u8e3s4 === 'string';
  } else {
    tmp = false;
  }
  if (tmp) {
    var char = single(chars);
    // Inline function 'kotlin.text.nativeIndexOf' call
    // Inline function 'kotlin.text.nativeIndexOf' call
    var str = toString(char);
    // Inline function 'kotlin.js.asDynamic' call
    return _this__u8e3s4.indexOf(str, startIndex);
  }
  var inductionVariable = coerceAtLeast(startIndex, 0);
  var last = get_lastIndex(_this__u8e3s4);
  if (inductionVariable <= last)
    do {
      var index = inductionVariable;
      inductionVariable = inductionVariable + 1 | 0;
      var charAtIndex = charSequenceGet(_this__u8e3s4, index);
      var tmp$ret$3;
      $l$block: {
        // Inline function 'kotlin.collections.any' call
        var inductionVariable_0 = 0;
        var last_0 = chars.length;
        while (inductionVariable_0 < last_0) {
          var element = chars[inductionVariable_0];
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          if (equals(element, charAtIndex, ignoreCase)) {
            tmp$ret$3 = true;
            break $l$block;
          }
        }
        tmp$ret$3 = false;
      }
      if (tmp$ret$3)
        return index;
    }
     while (!(index === last));
  return -1;
}
function indexOf_0(_this__u8e3s4, other, startIndex, endIndex, ignoreCase, last) {
  last = last === VOID ? false : last;
  var indices = !last ? numberRangeToNumber(coerceAtLeast(startIndex, 0), coerceAtMost(endIndex, charSequenceLength(_this__u8e3s4))) : downTo(coerceAtMost(startIndex, get_lastIndex(_this__u8e3s4)), coerceAtLeast(endIndex, 0));
  var tmp;
  if (typeof _this__u8e3s4 === 'string') {
    tmp = typeof other === 'string';
  } else {
    tmp = false;
  }
  if (tmp) {
    var inductionVariable = indices.first_1;
    var last_0 = indices.last_1;
    var step = indices.step_1;
    if (step > 0 && inductionVariable <= last_0 || (step < 0 && last_0 <= inductionVariable))
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + step | 0;
        if (regionMatches(other, 0, _this__u8e3s4, index, other.length, ignoreCase))
          return index;
      }
       while (!(index === last_0));
  } else {
    var inductionVariable_0 = indices.first_1;
    var last_1 = indices.last_1;
    var step_0 = indices.step_1;
    if (step_0 > 0 && inductionVariable_0 <= last_1 || (step_0 < 0 && last_1 <= inductionVariable_0))
      do {
        var index_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + step_0 | 0;
        if (regionMatchesImpl(other, 0, _this__u8e3s4, index_0, charSequenceLength(other), ignoreCase))
          return index_0;
      }
       while (!(index_0 === last_1));
  }
  return -1;
}
function get_lastIndex(_this__u8e3s4) {
  return charSequenceLength(_this__u8e3s4) - 1 | 0;
}
function regionMatchesImpl(_this__u8e3s4, thisOffset, other, otherOffset, length, ignoreCase) {
  if (otherOffset < 0 || thisOffset < 0 || thisOffset > (charSequenceLength(_this__u8e3s4) - length | 0) || otherOffset > (charSequenceLength(other) - length | 0)) {
    return false;
  }
  var inductionVariable = 0;
  if (inductionVariable < length)
    do {
      var index = inductionVariable;
      inductionVariable = inductionVariable + 1 | 0;
      if (!equals(charSequenceGet(_this__u8e3s4, thisOffset + index | 0), charSequenceGet(other, otherOffset + index | 0), ignoreCase))
        return false;
    }
     while (inductionVariable < length);
  return true;
}
function rangesDelimitedBy$lambda($delimiters, $ignoreCase) {
  return function ($this$DelimitedRangesSequence, currentIndex) {
    // Inline function 'kotlin.let' call
    var it = indexOfAny($this$DelimitedRangesSequence, $delimiters, currentIndex, $ignoreCase);
    return it < 0 ? null : to(it, 1);
  };
}
function Pair(first, second) {
  this.first_1 = first;
  this.second_1 = second;
}
protoOf(Pair).toString = function () {
  return '(' + toString_0(this.first_1) + ', ' + toString_0(this.second_1) + ')';
};
protoOf(Pair).component1_7eebsc_k$ = function () {
  return this.first_1;
};
protoOf(Pair).component2_7eebsb_k$ = function () {
  return this.second_1;
};
function to(_this__u8e3s4, that) {
  return new Pair(_this__u8e3s4, that);
}
function SinglesInput(own, opponent, format, ownSafety, opponentSafety, ownAge, opponentAge) {
  ownSafety = ownSafety === VOID ? SafetyStatus_SAFE_getInstance() : ownSafety;
  opponentSafety = opponentSafety === VOID ? SafetyStatus_SAFE_getInstance() : opponentSafety;
  ownAge = ownAge === VOID ? AgeGroup_ADULT_getInstance() : ownAge;
  opponentAge = opponentAge === VOID ? AgeGroup_ADULT_getInstance() : opponentAge;
  this.own_1 = own;
  this.opponent_1 = opponent;
  this.format_1 = format;
  this.ownSafety_1 = ownSafety;
  this.opponentSafety_1 = opponentSafety;
  this.ownAge_1 = ownAge;
  this.opponentAge_1 = opponentAge;
}
protoOf(SinglesInput).toString = function () {
  return 'SinglesInput(own=' + this.own_1 + ', opponent=' + this.opponent_1 + ', format=' + this.format_1.toString() + ', ownSafety=' + this.ownSafety_1.toString() + ', opponentSafety=' + this.opponentSafety_1.toString() + ', ownAge=' + this.ownAge_1.toString() + ', opponentAge=' + this.opponentAge_1.toString() + ')';
};
function DoublesInput(own, partner, opponent1, opponent2, format) {
  this.own_1 = own;
  this.partner_1 = partner;
  this.opponent1__1 = opponent1;
  this.opponent2__1 = opponent2;
  this.format_1 = format;
}
protoOf(DoublesInput).toString = function () {
  return 'DoublesInput(own=' + this.own_1 + ', partner=' + this.partner_1 + ', opponent1=' + this.opponent1__1 + ', opponent2=' + this.opponent2__1 + ', format=' + this.format_1.toString() + ')';
};
function Projection(before, after) {
  this.before_1 = before;
  this.after_1 = after;
}
protoOf(Projection).get_change_bw3k55_k$ = function () {
  return ItnCalculator_instance.roundItn_46ns0f_k$(this.after_1 - this.before_1);
};
protoOf(Projection).toString = function () {
  return 'Projection(before=' + this.before_1 + ', after=' + this.after_1 + ')';
};
var static_init_called;
function static_init() {
  if (static_init_called)
    return Unit_instance;
  static_init_called = true;
  WinKind_UPSET_instance = new WinKind('UPSET', 0);
  WinKind_EXPECTED_instance = new WinKind('EXPECTED', 1);
  WinKind_EVEN_instance = new WinKind('EVEN', 2);
}
var WinKind_UPSET_instance;
var WinKind_EXPECTED_instance;
var WinKind_EVEN_instance;
function WinKind(name, ordinal) {
  Enum.call(this, name, ordinal);
}
function SinglesResult(win, loss, winKind) {
  this.win_1 = win;
  this.loss_1 = loss;
  this.winKind_1 = winKind;
}
protoOf(SinglesResult).toString = function () {
  return 'SinglesResult(win=' + this.win_1.toString() + ', loss=' + this.loss_1.toString() + ', winKind=' + this.winKind_1.toString() + ')';
};
function SinglesFactors(win, loss) {
  this.win_1 = win;
  this.loss_1 = loss;
}
protoOf(SinglesFactors).toString = function () {
  return 'SinglesFactors(win=' + this.win_1 + ', loss=' + this.loss_1 + ')';
};
function DoublesResult(ownTeamAvg, opponentTeamAvg, win, loss, partnerWin, partnerLoss) {
  this.ownTeamAvg_1 = ownTeamAvg;
  this.opponentTeamAvg_1 = opponentTeamAvg;
  this.win_1 = win;
  this.loss_1 = loss;
  this.partnerWin_1 = partnerWin;
  this.partnerLoss_1 = partnerLoss;
}
protoOf(DoublesResult).toString = function () {
  return 'DoublesResult(ownTeamAvg=' + this.ownTeamAvg_1 + ', opponentTeamAvg=' + this.opponentTeamAvg_1 + ', win=' + this.win_1.toString() + ', loss=' + this.loss_1.toString() + ', partnerWin=' + this.partnerWin_1.toString() + ', partnerLoss=' + this.partnerLoss_1.toString() + ')';
};
function changeOf($this, roundedDelta, factor) {
  return $this.roundItn_46ns0f_k$(roundedDelta * factor);
}
function project($this, before, signedChange) {
  return new Projection($this.roundItn_46ns0f_k$(before), $this.roundItn_46ns0f_k$($this.clampItn_2353fi_k$(before + signedChange)));
}
function ItnCalculator() {
  this.MIN_ITN_1 = 1.0;
  this.MAX_ITN_1 = 10.0;
  this.DOUBLES_SHARE_1 = 0.25;
  this.YOUTH_WIN_FACTOR_1 = 2.0;
  this.ADULT_LOSS_TO_YOUTH_FACTOR_1 = 0.5;
}
protoOf(ItnCalculator).rawDelta_l7id68_k$ = function (winnerItn, loserItn) {
  // Inline function 'kotlin.math.exp' call
  var x = 3.5 * (loserItn - winnerItn);
  return 0.25 / (1.0 + 2.595 * Math.exp(x));
};
protoOf(ItnCalculator).roundItn_46ns0f_k$ = function (v) {
  // Inline function 'kotlin.Long.div' call
  var this_0 = toMilli(v);
  return toNumber(this_0) / 1000.0;
};
protoOf(ItnCalculator).clampItn_2353fi_k$ = function (v) {
  return coerceIn(v, 1.0, 10.0);
};
protoOf(ItnCalculator).safetyFactor_h4x8kh_k$ = function (own, other) {
  return own.equals(other) ? 1.0 : own.equals(SafetyStatus_UNSAFE_getInstance()) ? 2.0 : 0.5;
};
protoOf(ItnCalculator).singlesFactor_3m96rz_k$ = function (format, own, other) {
  return format.factor_1 * this.safetyFactor_h4x8kh_k$(own, other);
};
protoOf(ItnCalculator).doublesFactor_gvva08_k$ = function (format) {
  return format.factor_1 * 0.25;
};
protoOf(ItnCalculator).singlesFactors_59zwrq_k$ = function (input) {
  var normalFactor = this.singlesFactor_3m96rz_k$(input.format_1, input.ownSafety_1, input.opponentSafety_1);
  var ownYouthVsAdult = input.ownAge_1.equals(AgeGroup_YOUTH_getInstance()) && input.opponentAge_1.equals(AgeGroup_ADULT_getInstance());
  var ownAdultVsYouth = input.ownAge_1.equals(AgeGroup_ADULT_getInstance()) && input.opponentAge_1.equals(AgeGroup_YOUTH_getInstance());
  return new SinglesFactors(ownYouthVsAdult ? input.format_1.factor_1 * 2.0 : normalFactor, ownAdultVsYouth ? input.format_1.factor_1 * 0.5 : normalFactor);
};
protoOf(ItnCalculator).singles_qc3seg_k$ = function (input) {
  var factors = this.singlesFactors_59zwrq_k$(input);
  var winDelta = this.roundItn_46ns0f_k$(this.rawDelta_l7id68_k$(input.own_1, input.opponent_1));
  var lossDelta = this.roundItn_46ns0f_k$(this.rawDelta_l7id68_k$(input.opponent_1, input.own_1));
  var winKind = compare(toMilli(input.opponent_1), toMilli(input.own_1)) < 0 ? WinKind_UPSET_getInstance() : compare(toMilli(input.opponent_1), toMilli(input.own_1)) > 0 ? WinKind_EXPECTED_getInstance() : WinKind_EVEN_getInstance();
  return new SinglesResult(project(this, input.own_1, -changeOf(this, winDelta, factors.win_1)), project(this, input.own_1, +changeOf(this, lossDelta, factors.loss_1)), winKind);
};
protoOf(ItnCalculator).doubles_t8wm92_k$ = function (input) {
  var ownAvg = (input.own_1 + input.partner_1) / 2.0;
  var opponentAvg = (input.opponent1__1 + input.opponent2__1) / 2.0;
  var factor = this.doublesFactor_gvva08_k$(input.format_1);
  var winChange = changeOf(this, this.roundItn_46ns0f_k$(this.rawDelta_l7id68_k$(ownAvg, opponentAvg)), factor);
  var lossChange = changeOf(this, this.roundItn_46ns0f_k$(this.rawDelta_l7id68_k$(opponentAvg, ownAvg)), factor);
  return new DoublesResult(ownAvg, opponentAvg, project(this, input.own_1, -winChange), project(this, input.own_1, +lossChange), project(this, input.partner_1, -winChange), project(this, input.partner_1, +lossChange));
};
var ItnCalculator_instance;
function ItnCalculator_getInstance() {
  return ItnCalculator_instance;
}
function WinKind_UPSET_getInstance() {
  static_init();
  return WinKind_UPSET_instance;
}
function WinKind_EXPECTED_getInstance() {
  static_init();
  return WinKind_EXPECTED_instance;
}
function WinKind_EVEN_getInstance() {
  static_init();
  return WinKind_EVEN_instance;
}
function toMilli(value) {
  // Inline function 'kotlin.math.abs' call
  // Inline function 'kotlin.math.floor' call
  var x = Math.abs(value) * 1000.0 + 0.5 + 1.0E-6;
  var tmp$ret$1 = Math.floor(x);
  var magnitude = numberToLong(tmp$ret$1);
  return value < 0 ? negate(magnitude) : magnitude;
}
function formatMilli($this, milli) {
  var sign = compare(milli, new Long(0, 0)) < 0 ? '\u2212' : '';
  var magnitude = abs(milli);
  // Inline function 'kotlin.Long.div' call
  var tmp = divide(magnitude, fromInt(1000)).toString();
  // Inline function 'kotlin.Long.rem' call
  var tmp$ret$1 = modulo(magnitude, fromInt(1000));
  return sign + tmp + ',' + padStart(tmp$ret$1.toString(), 3, _Char___init__impl__6a9atx(48));
}
function ItnFormat() {
}
protoOf(ItnFormat).value_pfghfv_k$ = function (itn) {
  return formatMilli(this, toMilli(itn));
};
protoOf(ItnFormat).delta_8qadam_k$ = function (change) {
  var milli = toMilli(change);
  return (compare(milli, new Long(0, 0)) < 0 ? '\u2212' : '+') + formatMilli(this, abs(milli));
};
protoOf(ItnFormat).average_ul97qv_k$ = function (itn) {
  return '\xD8 ' + this.value_pfghfv_k$(itn);
};
var ItnFormat_instance;
function ItnFormat_getInstance() {
  return ItnFormat_instance;
}
function ItnInputParser() {
  ItnInputParser_instance = this;
  this.MIN_MILLI_1 = new Long(1000, 0);
  this.MAX_MILLI_1 = new Long(10000, 0);
}
protoOf(ItnInputParser).parse_pc1q8p_k$ = function (text) {
  // Inline function 'kotlin.text.trim' call
  var trimmed = toString_1(trim(isCharSequence(text) ? text : THROW_CCE()));
  // Inline function 'kotlin.text.isEmpty' call
  if (charSequenceLength(trimmed) === 0)
    return null;
  // Inline function 'kotlin.text.count' call
  var count = 0;
  var inductionVariable = 0;
  while (inductionVariable < charSequenceLength(trimmed)) {
    var element = charSequenceGet(trimmed, inductionVariable);
    inductionVariable = inductionVariable + 1 | 0;
    if (element === _Char___init__impl__6a9atx(44) || element === _Char___init__impl__6a9atx(46)) {
      count = count + 1 | 0;
    }
  }
  var separators = count;
  if (separators > 1)
    return null;
  var parts = split(trimmed, charArrayOf([_Char___init__impl__6a9atx(44), _Char___init__impl__6a9atx(46)]));
  var whole = parts.get_c1px32_k$(0);
  // Inline function 'kotlin.collections.getOrElse' call
  var tmp;
  if (0 <= 1 ? 1 < parts.get_size_woubt6_k$() : false) {
    tmp = parts.get_c1px32_k$(1);
  } else {
    tmp = '';
  }
  var fraction = tmp;
  var tmp_0;
  var tmp_1;
  // Inline function 'kotlin.text.isEmpty' call
  if (charSequenceLength(whole) === 0) {
    tmp_1 = true;
  } else {
    tmp_1 = whole.length > 2;
  }
  if (tmp_1) {
    tmp_0 = true;
  } else {
    var tmp$ret$7;
    $l$block: {
      // Inline function 'kotlin.text.all' call
      var inductionVariable_0 = 0;
      while (inductionVariable_0 < charSequenceLength(whole)) {
        var element_0 = charSequenceGet(whole, inductionVariable_0);
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        if (!(_Char___init__impl__6a9atx(48) <= element_0 ? element_0 <= _Char___init__impl__6a9atx(57) : false)) {
          tmp$ret$7 = false;
          break $l$block;
        }
      }
      tmp$ret$7 = true;
    }
    tmp_0 = !tmp$ret$7;
  }
  if (tmp_0)
    return null;
  var tmp_2;
  if (separators === 1) {
    // Inline function 'kotlin.text.isEmpty' call
    tmp_2 = charSequenceLength(fraction) === 0;
  } else {
    tmp_2 = false;
  }
  if (tmp_2)
    return null;
  var tmp_3;
  if (fraction.length > 3) {
    tmp_3 = true;
  } else {
    var tmp$ret$10;
    $l$block_0: {
      // Inline function 'kotlin.text.all' call
      var inductionVariable_1 = 0;
      while (inductionVariable_1 < charSequenceLength(fraction)) {
        var element_1 = charSequenceGet(fraction, inductionVariable_1);
        inductionVariable_1 = inductionVariable_1 + 1 | 0;
        if (!(_Char___init__impl__6a9atx(48) <= element_1 ? element_1 <= _Char___init__impl__6a9atx(57) : false)) {
          tmp$ret$10 = false;
          break $l$block_0;
        }
      }
      tmp$ret$10 = true;
    }
    tmp_3 = !tmp$ret$10;
  }
  if (tmp_3)
    return null;
  // Inline function 'kotlin.Long.times' call
  var this_0 = toLong(whole);
  var tmp$ret$12 = multiply(this_0, fromInt(1000));
  var milli = add(tmp$ret$12, toLong(padEnd(fraction, 3, _Char___init__impl__6a9atx(48))));
  if (!(compare(new Long(1000, 0), milli) <= 0 ? compare(milli, new Long(10000, 0)) <= 0 : false))
    return null;
  // Inline function 'kotlin.Long.div' call
  return toNumber(milli) / 1000.0;
};
var ItnInputParser_instance;
function ItnInputParser_getInstance() {
  if (ItnInputParser_instance == null)
    new ItnInputParser();
  return ItnInputParser_instance;
}
var static_init_called_0;
function static_init_0() {
  if (static_init_called_0)
    return Unit_instance;
  static_init_called_0 = true;
  AgeGroup_YOUTH_instance = new AgeGroup('YOUTH', 0);
  AgeGroup_ADULT_instance = new AgeGroup('ADULT', 1);
  AgeGroup_OTHER_instance = new AgeGroup('OTHER', 2);
}
var AgeGroup_YOUTH_instance;
var AgeGroup_ADULT_instance;
var AgeGroup_OTHER_instance;
function AgeGroup(name, ordinal) {
  Enum.call(this, name, ordinal);
}
function AgeGroup_YOUTH_getInstance() {
  static_init_0();
  return AgeGroup_YOUTH_instance;
}
function AgeGroup_ADULT_getInstance() {
  static_init_0();
  return AgeGroup_ADULT_instance;
}
var static_init_called_1;
function static_init_1() {
  if (static_init_called_1)
    return Unit_instance;
  static_init_called_1 = true;
  MatchFormat_LONG_instance = new MatchFormat('LONG', 0, 1.0);
  MatchFormat_SHORT_instance = new MatchFormat('SHORT', 1, 0.5);
}
var MatchFormat_LONG_instance;
var MatchFormat_SHORT_instance;
function MatchFormat(name, ordinal, factor) {
  Enum.call(this, name, ordinal);
  this.factor_1 = factor;
}
var static_init_called_2;
function static_init_2() {
  if (static_init_called_2)
    return Unit_instance;
  static_init_called_2 = true;
  SafetyStatus_SAFE_instance = new SafetyStatus('SAFE', 0);
  SafetyStatus_UNSAFE_instance = new SafetyStatus('UNSAFE', 1);
}
var SafetyStatus_SAFE_instance;
var SafetyStatus_UNSAFE_instance;
function SafetyStatus(name, ordinal) {
  Enum.call(this, name, ordinal);
}
function MatchFormat_LONG_getInstance() {
  static_init_1();
  return MatchFormat_LONG_instance;
}
function MatchFormat_SHORT_getInstance() {
  static_init_1();
  return MatchFormat_SHORT_instance;
}
function SafetyStatus_SAFE_getInstance() {
  static_init_2();
  return SafetyStatus_SAFE_instance;
}
function SafetyStatus_UNSAFE_getInstance() {
  static_init_2();
  return SafetyStatus_UNSAFE_instance;
}
function itnParse(text) {
  return ItnInputParser_getInstance().parse_pc1q8p_k$(text);
}
function itnFormat(value) {
  return ItnFormat_instance.value_pfghfv_k$(value);
}
function itnFormatDelta(delta) {
  return ItnFormat_instance.delta_8qadam_k$(delta);
}
function itnRawDelta(winner, loser) {
  return ItnCalculator_instance.rawDelta_l7id68_k$(winner, loser);
}
function itnRound(v) {
  return ItnCalculator_instance.roundItn_46ns0f_k$(v);
}
function ItnSinglesView(winAfter, winChange, lossAfter, lossChange, winAfterText, winChangeText, lossAfterText, lossChangeText, winWeightPercent, lossWeightPercent, youthRuleActive, winKind) {
  this.winAfter = winAfter;
  this.winChange = winChange;
  this.lossAfter = lossAfter;
  this.lossChange = lossChange;
  this.winAfterText = winAfterText;
  this.winChangeText = winChangeText;
  this.lossAfterText = lossAfterText;
  this.lossChangeText = lossChangeText;
  this.winWeightPercent = winWeightPercent;
  this.lossWeightPercent = lossWeightPercent;
  this.youthRuleActive = youthRuleActive;
  this.winKind = winKind;
}
protoOf(ItnSinglesView).get_winAfter_k8p9ux_k$ = function () {
  return this.winAfter;
};
protoOf(ItnSinglesView).get_winChange_ate4fx_k$ = function () {
  return this.winChange;
};
protoOf(ItnSinglesView).get_lossAfter_i7h51s_k$ = function () {
  return this.lossAfter;
};
protoOf(ItnSinglesView).get_lossChange_2ua7k4_k$ = function () {
  return this.lossChange;
};
protoOf(ItnSinglesView).get_winAfterText_r1zoc6_k$ = function () {
  return this.winAfterText;
};
protoOf(ItnSinglesView).get_winChangeText_37tbn4_k$ = function () {
  return this.winChangeText;
};
protoOf(ItnSinglesView).get_lossAfterText_j3p4wt_k$ = function () {
  return this.lossAfterText;
};
protoOf(ItnSinglesView).get_lossChangeText_ydk615_k$ = function () {
  return this.lossChangeText;
};
protoOf(ItnSinglesView).get_winWeightPercent_6510je_k$ = function () {
  return this.winWeightPercent;
};
protoOf(ItnSinglesView).get_lossWeightPercent_h18ae9_k$ = function () {
  return this.lossWeightPercent;
};
protoOf(ItnSinglesView).get_youthRuleActive_7nhe98_k$ = function () {
  return this.youthRuleActive;
};
protoOf(ItnSinglesView).get_winKind_nkk6g7_k$ = function () {
  return this.winKind;
};
function itnSingles(own, opponent, short, ownSafe, opponentSafe, ownYouth, opponentYouth) {
  var ownAge = ageGroup(ownYouth);
  var opponentAge = ageGroup(opponentYouth);
  var input = new SinglesInput(own, opponent, format(short), safety(ownSafe), safety(opponentSafe), ownAge, opponentAge);
  var result = ItnCalculator_instance.singles_qc3seg_k$(input);
  var factors = ItnCalculator_instance.singlesFactors_59zwrq_k$(input);
  return new ItnSinglesView(result.win_1.after_1, result.win_1.get_change_bw3k55_k$(), result.loss_1.after_1, result.loss_1.get_change_bw3k55_k$(), ItnFormat_instance.value_pfghfv_k$(result.win_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.win_1.get_change_bw3k55_k$()), ItnFormat_instance.value_pfghfv_k$(result.loss_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.loss_1.get_change_bw3k55_k$()), percent(factors.win_1), percent(factors.loss_1), ownAge.equals(AgeGroup_YOUTH_getInstance()) && opponentAge.equals(AgeGroup_ADULT_getInstance()) || (ownAge.equals(AgeGroup_ADULT_getInstance()) && opponentAge.equals(AgeGroup_YOUTH_getInstance())), result.winKind_1.name_1);
}
function ItnDoublesView(ownTeamAvg, opponentTeamAvg, ownTeamAvgText, opponentTeamAvgText, winAfter, winChange, lossAfter, lossChange, winAfterText, winChangeText, lossAfterText, lossChangeText, partnerWinAfter, partnerWinChange, partnerLossAfter, partnerLossChange, partnerWinAfterText, partnerWinChangeText, partnerLossAfterText, partnerLossChangeText, weightPercent) {
  this.ownTeamAvg = ownTeamAvg;
  this.opponentTeamAvg = opponentTeamAvg;
  this.ownTeamAvgText = ownTeamAvgText;
  this.opponentTeamAvgText = opponentTeamAvgText;
  this.winAfter = winAfter;
  this.winChange = winChange;
  this.lossAfter = lossAfter;
  this.lossChange = lossChange;
  this.winAfterText = winAfterText;
  this.winChangeText = winChangeText;
  this.lossAfterText = lossAfterText;
  this.lossChangeText = lossChangeText;
  this.partnerWinAfter = partnerWinAfter;
  this.partnerWinChange = partnerWinChange;
  this.partnerLossAfter = partnerLossAfter;
  this.partnerLossChange = partnerLossChange;
  this.partnerWinAfterText = partnerWinAfterText;
  this.partnerWinChangeText = partnerWinChangeText;
  this.partnerLossAfterText = partnerLossAfterText;
  this.partnerLossChangeText = partnerLossChangeText;
  this.weightPercent = weightPercent;
}
protoOf(ItnDoublesView).get_ownTeamAvg_himjbs_k$ = function () {
  return this.ownTeamAvg;
};
protoOf(ItnDoublesView).get_opponentTeamAvg_exsoj3_k$ = function () {
  return this.opponentTeamAvg;
};
protoOf(ItnDoublesView).get_ownTeamAvgText_x1nkx1_k$ = function () {
  return this.ownTeamAvgText;
};
protoOf(ItnDoublesView).get_opponentTeamAvgText_v6lu64_k$ = function () {
  return this.opponentTeamAvgText;
};
protoOf(ItnDoublesView).get_winAfter_k8p9ux_k$ = function () {
  return this.winAfter;
};
protoOf(ItnDoublesView).get_winChange_ate4fx_k$ = function () {
  return this.winChange;
};
protoOf(ItnDoublesView).get_lossAfter_i7h51s_k$ = function () {
  return this.lossAfter;
};
protoOf(ItnDoublesView).get_lossChange_2ua7k4_k$ = function () {
  return this.lossChange;
};
protoOf(ItnDoublesView).get_winAfterText_r1zoc6_k$ = function () {
  return this.winAfterText;
};
protoOf(ItnDoublesView).get_winChangeText_37tbn4_k$ = function () {
  return this.winChangeText;
};
protoOf(ItnDoublesView).get_lossAfterText_j3p4wt_k$ = function () {
  return this.lossAfterText;
};
protoOf(ItnDoublesView).get_lossChangeText_ydk615_k$ = function () {
  return this.lossChangeText;
};
protoOf(ItnDoublesView).get_partnerWinAfter_k1hbhb_k$ = function () {
  return this.partnerWinAfter;
};
protoOf(ItnDoublesView).get_partnerWinChange_h18q5v_k$ = function () {
  return this.partnerWinChange;
};
protoOf(ItnDoublesView).get_partnerLossAfter_bzmjbu_k$ = function () {
  return this.partnerLossAfter;
};
protoOf(ItnDoublesView).get_partnerLossChange_hhp90y_k$ = function () {
  return this.partnerLossChange;
};
protoOf(ItnDoublesView).get_partnerWinAfterText_xhmb70_k$ = function () {
  return this.partnerWinAfterText;
};
protoOf(ItnDoublesView).get_partnerWinChangeText_gunt0m_k$ = function () {
  return this.partnerWinChangeText;
};
protoOf(ItnDoublesView).get_partnerLossAfterText_5gunjb_k$ = function () {
  return this.partnerLossAfterText;
};
protoOf(ItnDoublesView).get_partnerLossChangeText_x54ipt_k$ = function () {
  return this.partnerLossChangeText;
};
protoOf(ItnDoublesView).get_weightPercent_fnubuk_k$ = function () {
  return this.weightPercent;
};
function itnDoubles(own, partner, opponent1, opponent2, short) {
  var format_0 = format(short);
  var result = ItnCalculator_instance.doubles_t8wm92_k$(new DoublesInput(own, partner, opponent1, opponent2, format_0));
  return new ItnDoublesView(result.ownTeamAvg_1, result.opponentTeamAvg_1, ItnFormat_instance.average_ul97qv_k$(result.ownTeamAvg_1), ItnFormat_instance.average_ul97qv_k$(result.opponentTeamAvg_1), result.win_1.after_1, result.win_1.get_change_bw3k55_k$(), result.loss_1.after_1, result.loss_1.get_change_bw3k55_k$(), ItnFormat_instance.value_pfghfv_k$(result.win_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.win_1.get_change_bw3k55_k$()), ItnFormat_instance.value_pfghfv_k$(result.loss_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.loss_1.get_change_bw3k55_k$()), result.partnerWin_1.after_1, result.partnerWin_1.get_change_bw3k55_k$(), result.partnerLoss_1.after_1, result.partnerLoss_1.get_change_bw3k55_k$(), ItnFormat_instance.value_pfghfv_k$(result.partnerWin_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.partnerWin_1.get_change_bw3k55_k$()), ItnFormat_instance.value_pfghfv_k$(result.partnerLoss_1.after_1), ItnFormat_instance.delta_8qadam_k$(result.partnerLoss_1.get_change_bw3k55_k$()), percent(ItnCalculator_instance.doublesFactor_gvva08_k$(format_0)));
}
function format(short) {
  return short ? MatchFormat_SHORT_getInstance() : MatchFormat_LONG_getInstance();
}
function safety(safe) {
  return safe ? SafetyStatus_SAFE_getInstance() : SafetyStatus_UNSAFE_getInstance();
}
function ageGroup(youth) {
  return youth ? AgeGroup_YOUTH_getInstance() : AgeGroup_ADULT_getInstance();
}
function percent(factor) {
  return roundToInt(factor * 1000.0) / 10.0;
}
//region block: init
Companion_instance = new Companion();
Unit_instance = new Unit();
Companion_instance_2 = new Companion_2();
Companion_instance_4 = new Companion_4();
ItnCalculator_instance = new ItnCalculator();
ItnFormat_instance = new ItnFormat();
//endregion
//region block: exports
export {
  itnParse as itnParse,
  itnFormat as itnFormat,
  itnFormatDelta as itnFormatDelta,
  itnRawDelta as itnRawDelta,
  itnRound as itnRound,
  ItnSinglesView as ItnSinglesView,
  itnSingles as itnSingles,
  ItnDoublesView as ItnDoublesView,
  itnDoubles as itnDoubles,
};
//endregion
