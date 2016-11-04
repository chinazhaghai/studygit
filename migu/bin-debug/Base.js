var Base = (function (_super) {
    __extends(Base, _super);
    function Base() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Base,p=c.prototype;
    p.onAddToStage = function () {
    };
    p.getImage = function (_src) {
        var tmp = new egret.Bitmap;
        tmp.texture = RES.getRes(_src);
        return tmp;
    };
    /*
    * @function setPosition
    * @desc 设置图片的坐标
    * @params
    * _bitmap : egret.Bitmap
    * _x : number x轴坐标
    * _y : number y轴坐标
    * _align:string none both center vertical
    */
    p.setPosition = function (_bitmap, _x, _y, _align) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_align === void 0) { _align = 'none'; }
        switch (_align) {
            case 'none':
                _bitmap.x = _x;
                _bitmap.y = _y;
                break;
            case 'both':
                _bitmap.x = (this.width - _bitmap.width) / 2;
                _bitmap.y = (this.height - _bitmap.height) / 2;
                break;
            case 'center':
                _bitmap.x = (this.width - _bitmap.width) / 2;
                _bitmap.y = _y;
                break;
            case 'vertical':
                _bitmap.x = _x;
                _bitmap.y = (this.height - this.height) / 2;
                break;
            default:
                _bitmap.x = _x;
                _bitmap.y = _y;
                break;
        }
        _bitmap.x += _bitmap.anchorOffsetX;
        _bitmap.y += _bitmap.anchorOffsetY;
    };
    /*
    * @function setPosition
    * @desc 设置图片的中心
    * @params
    * _bitmap : egret.Bitmap
    * _center:string none both center vertical
    */
    p.setCenter = function (_bitmap, _center) {
        if (_center === void 0) { _center = 'none'; }
        switch (_center) {
            case 'both':
                _bitmap.anchorOffsetX = _bitmap.width / 2;
                _bitmap.anchorOffsetY = _bitmap.height / 2;
                break;
            case 'center':
                _bitmap.anchorOffsetX = _bitmap.width / 2;
                break;
            case 'vertical':
                _bitmap.anchorOffsetY = _bitmap.height / 2;
                break;
            default:
                break;
        }
    };
    return Base;
}(egret.DisplayObjectContainer));
egret.registerClass(Base,'Base');
//# sourceMappingURL=Base.js.map