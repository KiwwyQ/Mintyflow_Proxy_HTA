		window.resizeTo(310, 420);

		document.onselectstart = function() { return false; }

    	function cmd(command, wait){
        	var shell = new ActiveXObject("WScript.Shell"),
        	exec = shell.Run(command, 0, wait);
    	}

    	function exec(cmdc){
    		var WShell = new ActiveXObject('WScript.Shell');
			var WShellExec = WShell.Exec(cmdc);

			return WShellExec.StdOut.ReadAll();
    	}

    	function fetch(url){
    		cmd('cmd.exe /c echo NULL > .cdata', true);
    		cmd('win_get.exe "'+url+'"', true);
    		var data = exec('cmd.exe /c type .cdata');
    		return data;
    	}

    	//cmd('win_get.exe http://example.com');
    	//alert(exec('cmd.exe /c type .cdata'));

    	function startIE() {
            var objIE = new ActiveXObject("InternetExplorer.Application");
            objIE.Visible = false;
            objIE.Navigate("about:blank");

            while (objIE.Busy || objIE.ReadyState != 4) {
                WScript.Sleep(100);
            }

            objIE.Quit();
        }

    	cmd('win_proxy.exe --disable', true);

			function salt(){
				return (((Math.random()+Math.random())*2)+Math.random()*2)+Math.random();
			}

			var VERSION = "0.0.3";

			var IP = "0.0.0.0";
			var PORT = 0;
			var NAME = 'Undefined';

			var STATE = false;

			var is_synced = false;

			var ERROR = 'No reply from API?';

			document.getElementById("cinf").innerText = "Minty Client v"+VERSION;

			function get_name(){
				var fetch_data = fetch('http://API_URL_HERE/?txt=name&i='+salt());
				if (fetch_data != 'NULL'){
					document.getElementById("srv_name").innerText = fetch_data;
       				NAME = fetch_data;
				} else {
					document.getElementById("srv_name").innerText = 'Awaiting API reply...';
    				window.setTimeout(function (){
    					get_name();
    				}, 5500);
				}
			}

			function get_conf(){
				if (is_synced){
					return 0;
				}
				document.getElementById("srv_name").innerText = 'Sending API request...';
				var fetch_conf = fetch('http://API_URL_HERE/?txt=addr&i='+salt());
				if (fetch_conf != 'NULL'){
					ERROR = fetch_conf;
       				if (fetch_conf.split(":")[0]){
       					IP = fetch_conf.split(":")[0];
       					PORT = fetch_conf.split(":")[1];
       					is_synced = true;
       					get_name();
       				} else {
    					document.getElementById("srv_name").innerText = 'Awaiting API reply...';
    					window.setTimeout(function (){
    						get_conf();
    					}, 5500);
       				}
				}
			}

			var dots = 0;
			function connect(){
			if (!is_synced){
				document.getElementById("srv_name").innerText = "BAD CONFIG! :(";
				alert("ERROR: Wrong or Malfromed data?\nPort="+PORT+", Ip="+IP+", Name="+NAME+", Is_Synced="+is_synced+"\nAPI Reply: "+ERROR);
				return;
			}
			if (!STATE){
				STATE = true;
				document.getElementById("st-cir-txt").innerText = "Connecting...";
				document.getElementById("st-cir").style.color = "yellow";
				document.getElementById("st-txt").innerText = "Connecting";
				var anim = setInterval(function (){
					switch (dots){
					case 0:
						dots = 1;
						document.getElementById("st-txt").innerText = "Connecting";
					break;
					case 1:
						dots = 2;
						document.getElementById("st-txt").innerText = "\x0bConnecting.";
					break;
					case 2:
						dots = 3;
						document.getElementById("st-txt").innerText = "\x0b\x0bConnecting..";
					break;
				case 3:
						dots = 0;
						document.getElementById("st-txt").innerText = "\x0b\x0b\x0bConnecting...";
					break;
					}
				}, 300);
				document.getElementById("srv_name").innerText = "Checking config...";
					if (is_synced && !isNaN(PORT) && IP.split(".")[0]){
						document.getElementById("srv_name").innerText = "Configuring...";
						cmd('win_proxy.exe --enable --host '+IP+' --port '+PORT, true);
						setTimeout(startIE, 1300);
						document.getElementById("srv_name").innerText = NAME;
						clearInterval(anim);
						document.getElementById("st-txt").innerText = "Connected";
						document.getElementById("st-cir-txt").innerText = "Connected!";
						document.getElementById("st-cir").style.color = "green";
					} else {
						document.getElementById("srv_name").innerText = "BAD CONFIG! :(";
					}
				} else {
					STATE = false;
					document.getElementById("st-txt").innerText = "Disabling...";
					document.getElementById("st-cir-txt").innerText = "Disabling";
					document.getElementById("st-cir").style.color = "gray";
					document.getElementById("srv_name").innerText = "Disabling...";
					document.getElementById("srv_name").innerText = "Clearing settings...";
					cmd('win_proxy.exe --disable', true);
					setTimeout(startIE, 1300);
					document.getElementById("st-cir-txt").innerText = "Disconnected";
					document.getElementById("st-cir").style.color = "red";
					document.getElementById("st-txt").innerText = "Connect";
					document.getElementById("srv_name").innerText = NAME;
				}
			}