/**
 * Creates functions object
 *
 */
var DHTMLFunction = new Object();

/**
 * This one creates an entry point function
 * to use an anisochronous request method.
 * 
 * Usage:
 * var myObject = new DHTMLFunction.Ajax();
 * myObject.SendRequest(myRequestString, myCallbackFunctionName);
 */
DHTMLFunction.Ajax = function() {
	var xmlHttp;			// Complet xmlHttp request
	var serverScript;		// The server side script to send to query
	var Query;			// Contains query array
} // end DHTMLFunction.Ajax()

/**
 * Prototype for the the anisochronous request function
 *
 */
DHTMLFunction.Ajax.prototype = {
	
	createXmlHttp : function()
	{
		var xmlHttp;
		try
		{
			xmlHttp = new XMLHttpRequest();
		}
		catch(e)
		{
			var XmlHttpVersions = new Array('MSXML2.XMLHTTP.7.0',
							'MSXML2.XMLHTTP.6.0',
							'MSXML2.XMLHTTP.4.0',
							'MSXML2.XMLHTTP.3.0',
							'MSXML2.XMLHTTP',
							'Microsoft.XMLHTTP');
			
			for(var i=0; i < XmlHttpVersions.length; i++)
			{
				try
				{
					xmlHttp = new ActiveXObject(XmlHttpVersions[i]);
				}
				catch(e) { }
			}
		}
		return xmlHttp;
	}, // end createXmlHttp()
	
	
	/**
	 * Builds and returns complete query string from variable parts
	 * 
	 */
	completeQuery : function()
	{
		var _arr = new Array();
		var k = 0;
		
		// Combine query Array
		for(var i in this.Query)
			_arr[k++] = i + "=" + this.Query[i];
		
		return _arr.join("&");
	}, // end completeQuery()
	
	
	/**
	 * Starts anisochronous transaction and calls user function to operate
	 * result
	 * @param	callback function name
	 */
	SendRequest : function( process )
	{
		if(typeof process == "undefined" || process == "")
		{
			alert("Unknown client callback function!");
			return false;
		}
		
		if(typeof this.xmlHttp != "object")
		{
			this.xmlHttp = this.createXmlHttp();
		}
		
		var request = this.completeQuery();
		var result = false;
		if(this.xmlHttp && (this.xmlHttp.readyState == 0 || this.xmlHttp.readyState == 4))
		{
			try
			{
				this.xmlHttp.open("POST", this.serverScript, true);
				this.xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				this.xmlHttp.setRequestHeader('Content-length', request.length);
				
				var xmlHttp = this.xmlHttp;
				this.xmlHttp.onreadystatechange = function() {
					if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
					{
						process(xmlHttp.responseXML);
					}
				};

				this.xmlHttp.send(request);
			}
			catch(e)
			{
				alert("Error: " + e.toString());
			}
		}
	} // end SendRequest()
} // end DHTMLManDrop.Ajax.prototype { }


/**
 * This one gets information about client browser
 *
 */
DHTMLFunction.clientInfo = function()
{
	var browser;			// Complete user agent information
	var isOpera;			// Is the browser "Opera"
	var isMSIE;			// Is the browser "Internet Explorer"	
	var isFirefox;			// Is the browser "Firefox"
	var navigatorVersion;		// Browser version
	
	this.init();
} // end DHTMLFunction.clientInfo()


/**
 * Prototype for the clientInfo
 *
 */
DHTMLFunction.clientInfo.prototype = {
	
	init : function()
	{
		this.browser = navigator.userAgent;	
		this.isOpera = (this.browser.toLowerCase().indexOf('opera')>=0)?true:false;
		this.isFirefox = (this.browser.toLowerCase().indexOf('firefox')>=0)?true:false;
		this.isMSIE = (this.browser.toLowerCase().indexOf('msie')>=0)?true:false;
		this.isSafari = (this.browser.toLowerCase().indexOf('safari')>=0)?true:false;
		this.navigatorVersion = navigator.appVersion.replace(/.*?MSIE (\d\.\d).*/g,'$1')/1;
	} // end init()
} // end DHTMLFunction.clientInfo.prototype { }


/**
 * Collection of the functions for the common usage
 *
 */
DHTMLFunction.usefull = function()
{

} // end DHTMLFunction.usefull()


/**
 * Prototype for the usefull
 *
 */
DHTMLFunction.usefull.prototype = {
	
	/**
	 * Checks empty values similar php function
	 * Returns TRUE if empty or undefined, 0 is not empty
	 * 	   FALSE if not empty
	 */
	empty : function( value )
	{
		if( typeof value == "undefined" || value == "" || value == null)
			return true;
		else
			return false;
	}, // end empty()
	
	
	/**
	 * Checks if an element is array
	 * @param	object
	 */
	isArray : function( object )
	{
		if(this.empty(object)) return false;
		if(typeof object != "object" && !(object.join)) return false;
		return true;
	}, // end isArray()
	
	
	/**
	 * Remove spaces at the end and the begining of the string
	 * @param	String value
	 */
	trim : function( str )
	{
		str.replace("^\s+","");
		str.replace("\s+$","");
		return str;
	}, // end trim()
	
	
	/**
	 * Return Client browser size
	 *
	 */
	getBrowserSize : function()
	{
		var bodyWidth = document.documentElement.clientWidth;
		var bodyHeight = document.documentElement.clientHeight;
		
		var bodyWidth, bodyHeight;
		// All except Explorer
		if (self.innerHeight)
		{
			bodyWidth = self.innerWidth;
			bodyHeight = self.innerHeight;
		}
		// Explorer 6 Strict Mode
		else if (document.documentElement && document.documentElement.clientHeight)
		{
			bodyWidth = document.documentElement.clientWidth;
			bodyHeight = document.documentElement.clientHeight;
		}
		// other Explorers
		else if (document.body)
		{
			bodyWidth = document.body.clientWidth;
			bodyHeight = document.body.clientHeight;
		}
		return {
			width: bodyWidth,
			height: bodyHeight
		};
	}, // getBrowserSize()
	
	
	/**
	 * Adds event listener to element
	 * @var		Object handler
	 * @var		Which event type to set
	 * @var		Function name to call on event
	 */
	addEvent : function( whichObject, eventType, functionName, suffix )
	{
		if(!suffix)suffix = '';
		if(whichObject.attachEvent)
		{
			whichObject['e'+eventType+functionName+suffix] = functionName;
			whichObject[eventType+functionName+suffix] = function(){
				whichObject['e'+eventType+functionName+suffix]( window.event );
			}
			whichObject.attachEvent( 'on'+eventType, whichObject[eventType+functionName+suffix] ); 
		}
		else whichObject.addEventListener(eventType,functionName,false);
	}, // end addEvent()
	
	
	/**
	 * Removes event listener added to the element
	 * @var		Object handler
	 * @var		Which event type was set
	 * @var		Function name called on event
	 */
	removeEvent : function(whichObject,eventType,functionName)
	{
		if(whichObject.detachEvent)
		{
			whichObject.detachEvent('on'+eventType, whichObject[eventType+functionName]);
			whichObject[eventType+functionName] = null;
		}
		else whichObject.removeEventListener(eventType,functionName,false); 
	}, // end removeEvent()
	
	
	/**
	 * Returns position and size of the element in the document
	 * @var		Identifier of the element
	 */
	getBound : function( ID )
	{
		var elem = document.getElementById(ID);
		
		var left = elem.offsetLeft;
		var top = elem.offsetTop;
		for( var parent = elem.offsetParent; parent; parent = parent.offsetParent )
		{
			left += parent.offsetLeft - parent.scrollLeft;
			top += parent.offsetTop - parent.scrollTop
		}
	
		return {
			left: left, 
			top: top, 
			width: elem.offsetWidth, 
			height: elem.offsetHeight
		};
	}, //end getBound()
	
	
	/**
	 * Dynamic value change for the alpha chanel
	 * @var		Element id
	 * @var		Start param for the opacity
	 * @var		End param for the opacity
	 * @var		Time to run
	 */
	opacity : function( id, opacStart, opacEnd, millisec )
	{
		if(!document.getElementById(id)) return;
		window.changeOpac = this.changeOpac;
		
		//speed for each frame
		var speed = Math.round(millisec / 100);
		var timer = 0;
		
		//determine the direction for the blending, if start and end are the same nothing happens
		if(opacStart > opacEnd) {
			for(i = opacStart; i >= opacEnd; i--) {
				setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed));
				timer++;
			}
		} else if(opacStart < opacEnd) {
			for(i = opacStart; i <= opacEnd; i++)
			{
				setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed));
				timer++;
			}
		}
	}, // end opacity()
	
	
	/**
	 * Cross browsers changer of the opacity
	 * @var		Opacity value
	 * @var		element id
	 */
	changeOpac : function( opacity, id )
	{
		if(!document.getElementById(id)) return;
		var object = document.getElementById(id).style;
		object.opacity = (opacity / 100);
		object.MozOpacity = (opacity / 100);
		object.KhtmlOpacity = (opacity / 100);
		object.filter = "alpha(opacity=" + opacity + ")";
	} // changeOpac()
} // end DHTMLFunction.usefull.prototype { }


/**
 * This one builds the list of the key codes which are used
 * in javascript event control
 */
DHTMLFunction.KeyCodes = function()
{
	var functional;
	var literal;
	var integer;
	var symbolic;
	
	this.init();
} // end DHTMLFunction.KeyCodes()

/**
 * Prototype for the Key Codes function
 *
 */
DHTMLFunction.KeyCodes.prototype = {
	
	/**
	 * Initialize all key codes
	 *
	 */
	init : function()
	{
		this.functional = this.initFunctional();
		this.literal = this.initLiteral();
		this.integer = this.initInteger();
		this.symbolic = this.initSymbolic();
	}, // end init()
	
	
	/**
	 * Initialize the functional key array
	 *
	 */
	initFunctional : function()
	{
		_arr = new Array();
		for(var i = 8; i < 146; i++)
		{
			switch( true )
			{
				case (i > 9 && i < 13):
				case (i > 13 && i < 16):
				case (i > 20 && i < 27):
				case (i > 28 && i < 33):
				case (i > 40 && i < 45):
				case (i > 47 && i < 91):
				case (i == 92 || i == 94 || i == 95 || i == 108):
				case (i > 123 && i < 144): 
					continue;
				break;
			}
			_arr[i] = true;
		}
		
		return _arr;
	}, // end initFunctional()
	
	
	/**
	 * Initialize the literal array
	 *
	 */
	initLiteral : function()
	{
		var _arr = new Array();
		for(var i = 65; i < 91; i++) _arr[i] = true;
		return _arr;
	}, // end initLiteral()
	
	
	/**
	 * Initialize the integer array
	 *
	 */
	initInteger : function()
	{
		var _arr = new Array();
		for(var i = 48; i < 58; i++) _arr[i] = true;
		return _arr;
	}, // end initInteger()
	
	
	/**
	 * Initialize the symbolic key array
	 *
	 */
	initSymbolic : function()
	{
		var _arr = new Array();
		
		_arr[59] = true;
		_arr[61] = true;
		_arr[188] = true;
		_arr[190] = true;
		_arr[191] = true;
		_arr[192] = true;
		_arr[219] = true;
		_arr[220] = true;
		_arr[221] = true;
		_arr[222] = true;
		
		return _arr;
	} // end initSymbolic()
} // end DHTMLFunction.KeyCodes.prototype { }


/**
 * Binary operations with string
 * 
 */
DHTMLFunction.bin = function()
{
	var hexcase;		// hex output format. 0 - lowercase; 1 - uppercase
	var b64pad;		// base-64 pad character. "=" for strict RFC compliance
	var chrsz;		// bits per input character. 8 - ASCII; 16 - Unicode
	
	this.hexcase = 0;
	this.b64pad = "";
	this.chrsz = 8;
} // end DHTMLFunction.RFC()

DHTMLFunction.bin.prototype = {
	
	/**
	 * Convert a string to an array of little-endian words
	 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
	 *
	 */
	str2binl : function( str )
	{
		var bin = Array();
		var mask = (1 << this.chrsz) - 1 ;
		
		for(var i = 0 ; i < str.length * this.chrsz; i += this.chrsz)
			bin[i>> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i%32 );
		
		return  bin;
	}, // end
	
	
	/**
	 * Convert an array of little-endian words to a string
	 *
	 */
	binl2str : function( bin )
	{
		var str = "" ;
		var mask = (1 << this.chrsz) - 1 ;
		
		for(var i = 0; i < bin.length * 32 ; i += this.chrsz)
			str += String.fromCharCode((bin[i>> 5] >>> (i % 32 )) & mask);
		
		return  str;
	}, // end binl2str()
	
	
	/**
	 * Convert an array of little-endian words to a hex string.
	 * 
	 */
	binl2hex : function( binarray )
	{
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef" ;
		var str = "" ;
		for(var i = 0; i < binarray.length * 4 ; i++)
		{
			str += hex_tab.charAt((binarray[i>> 2] >> ((i%4)*8+4)) & 0xF ) +
				hex_tab.charAt((binarray[i>> 2] >> ((i%4)*8  )) & 0xF );
		}
		return  str;
	}, // end binl2hex()
	
	
	/**
	 * Convert an array of little-endian words to a base-64 string
	 *
	 */
	binl2b64 : function( binarray )
	{
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" ;
		var str = "" ;
		
		for(var i = 0; i < binarray.length * 4; i += 3 )
		{
			var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16 )
					| (((binarray[i+ 1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8  )
					|  ((binarray[i+ 2 >> 2] >> 8 * ((i+2)%4)) & 0xFF );
			
			for(var j = 0; j < 4 ; j++)
			{
				if(i * 8 + j * 6 > binarray.length * 32 ) str += this.b64pad;
				else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F );
			}
		}
		return  str;
	}
} // end 