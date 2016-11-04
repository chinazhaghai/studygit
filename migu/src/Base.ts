class Base extends egret.DisplayObjectContainer{
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
	}
	protected onAddToStage(){

	}
	protected getImage(_src:string):egret.Bitmap{
		var tmp = new egret.Bitmap;
		tmp.texture = RES.getRes(_src);
		return tmp;
	}
	/*
	* @function setPosition
	* @desc 设置图片的坐标
	* @params 
	* _bitmap : egret.Bitmap
	* _x : number x轴坐标
	* _y : number y轴坐标
	* _align:string none both center vertical
	*/
	protected setPosition(_bitmap:egret.Bitmap,_x:number=0,_y:number=0,_align:string='none'){
		switch(_align){
			case 'none':
				_bitmap.x = _x;
				_bitmap.y = _y;
				break;
			case 'both':
				_bitmap.x = (this.width - _bitmap.width)/2;
				_bitmap.y = (this.height-_bitmap.height)/2;
				break;
			case 'center':
				_bitmap.x = (this.width-_bitmap.width)/2;
				_bitmap.y = _y;
				break;
			case 'vertical':
				_bitmap.x = _x;
				_bitmap.y = (this.height-this.height)/2;
				break;
			default :
				_bitmap.x = _x;
				_bitmap.y = _y;
				break;
		}
		_bitmap.x += _bitmap.anchorOffsetX;
		_bitmap.y += _bitmap.anchorOffsetY;
	}
	/*
	* @function setPosition
	* @desc 设置图片的中心
	* @params 
	* _bitmap : egret.Bitmap
	* _center:string none both center vertical
	*/
	protected setCenter(_bitmap:egret.Bitmap,_center:string='none'){
		switch(_center){
			case 'both':
				_bitmap.anchorOffsetX = _bitmap.width/2;
				_bitmap.anchorOffsetY = _bitmap.height/2;
				break;
			case 'center':
				_bitmap.anchorOffsetX = _bitmap.width/2;
				break;
			case 'vertical':
				_bitmap.anchorOffsetY = _bitmap.height/2;
				break;
			default:
				break;
		}
	}
}