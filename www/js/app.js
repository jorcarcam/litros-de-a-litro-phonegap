var ESTADOS_SERVICE_URL = "http://178.63.61.196:8989/temp-gasolineras-back/v1/getEstados";
var MUNICIPIOS_SERVICE_URL = "http://178.63.61.196:8989/temp-gasolineras-back/v1/getMuniciposDelegacion?id=";
var GAS_POR_MUNICIPIO_SERVICE_URL = "http://178.63.61.196:8989/temp-gasolineras-back/v1/getNearStationsByIdEstadoAndIdMunicipioDelegacion?idEstado=";
var STATION_SERVICE_URL = "http://178.63.61.196:8989/temp-gasolineras-back/v1/getDetailGasStation?id=";

function reapplyStyles( el )
{
	el.find('ul[data-role]').listview();
	el.find('div[data-role="fieldcontain"]').fieldcontain();
    el.find('button[data-role="button"]').button();
    el.find('input,textarea').textinput();
	el.page();
}


function loadEstados() 
{
	$.mobile.pageLoading(); 
	$.ajax({
		url:ESTADOS_SERVICE_URL,
		success: function(data) {

			var estados = {estados:JSON.parse(data)};
			$('#estados_template').mustache(estados).appendTo('#estados_div');
			
			reapplyStyles( $('#estados_page') );
			$.mobile.pageLoading(true); 
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert('Error al conectarse al servidor');
			console.log(textStatus);
			$.mobile.pageLoading(true); 
		}
	});
}

function searchMunicipios( idEstado )
{
	localStorage['selectedEstado'] = idEstado;
	$.mobile.changePage( 'municipios.html' );
}

function loadMunicipios( )
{
	$.mobile.pageLoading(); 
	var idEstado = localStorage['selectedEstado'];
	var url = MUNICIPIOS_SERVICE_URL + idEstado;

	$.ajax({
		url:url,
		success: function(data) {
			var municipios = {municipios:JSON.parse(data)};
			$('#municipios_template').mustache(municipios).appendTo('#municipios_div');
			
			reapplyStyles( $('#municipios_page') );
			$.mobile.pageLoading(true); 
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert('Error al conectarse al servidor');
			console.log(textStatus);
			$.mobile.pageLoading(true); 
		}
	});
}

function searchGasolinerasPorMunicipio( idMunicipio )
{
	localStorage['selectedidMunicipio'] = idMunicipio;
	$.mobile.changePage( 'gasolineras_municipios.html' );
}

function loadGasolinerasMunicipios( )
{
	$.mobile.pageLoading(); 
	var idEstado = localStorage['selectedEstado'];
	var idMunicipio = localStorage['selectedMunicipio'];
	var url = GAS_POR_MUNICIPIO_SERVICE_URL + idEstado + '&idMunicipio=' + idMunicipio;
	$.ajax({
		url:url,
		success: function(data) {
			var gasolineras = JSON.parse(data)
			for( var i = 0; i < gasolineras.length; i++ ) {
				var station = gasolineras[i];
				station = addLightToGasStation(station);
			}
			$('#gas_municipios_template').mustache({gasolineras:gasolineras}).appendTo('#gas_municipios_div');
			
			reapplyStyles( $('#gas_municipios_page') );
			$.mobile.pageLoading(true); 
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert('Error al conectarse al servidor');
			console.log(textStatus);
			$.mobile.pageLoading(true); 
		}
	});
}



function addLightToGasStation( gasStation ) {
	switch( gasStation.semaforo ) {
		case 1: gasStation.green    = true; break;
		case 2: gasStation.orange   = true; break;
		case 3: gasStation.red      = true; break;
		default: gasStation.noLight = true; break;
	}
	return gasStation	
}

function viewGasolineraInfo( idGasStation ) {
	localStorage['selectdGasStation'] = idGasStation;
	$.mobile.changePage('gasolinera_info.html');
}

function loadGasolineraInfo( ) {
	$.mobile.pageLoading();
	console.log('1');
	var idGasStation = localStorage['selectdGasStation'];
	console.log('2');
	var url = STATION_SERVICE_URL + idGasStation;
	console.log('3 ' + url);
	$.ajax({
		url:url,
		success: function(data) {
			console.log('4 ' + data);
			localStorage['currenGasStation'] = data;
			/*data = '{"id":"E00013","profecoId":478,"semaforo":2,"latitude":19.389182,"longitude":-99.190014,'+
			'"distancia":0.3,"urlImg":"http://farm3.static.flickr.com/2739/5797266876_fc443c12b9.jpg",'+
			'"urlHistoria":"http://webapps.profeco.gob.mx/verificacion/gasolina/gasolinera01.asp?IdEs=468",'+
			'"razonSocial":"SERVICIO SAN PEDRO, S.A. DE C.V.","direccion":"BLVD ADOLFO LOPEZ MATEOS NO 282_ESQ: CALLE 10",'+
			'"colonia":"SAN PEDRO DE LOS PINOS","cp":"01180","telefono":"55153860","cuall":"S","magma":"S","premium":"N",'+
			'"diesel":"S","dme":"N", "denuncias":4}';*/
			var gasolinera = JSON.parse(data);
			console.log('5 ' + gasolinera.semaforo);
			gasolinera = addLightToGasStation(gasolinera);			
			console.log('6');
			$('#gas_info_template').mustache(gasolinera).appendTo('#gas_info_div');			
			console.log('7');
			reapplyStyles( $('#gas_info_page') );
			console.log('8');
			
			$.mobile.pageLoading(true); 
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert('Error al conectarse al servidor');
			console.log(textStatus);
			$.mobile.pageLoading(true); 
		}
	});
}

function displayGasMap( ) {
	var station = JSON.parse( localStorage['currenGasStation'] );
	var marker = { latitude:station.latitude, longitude:station.longitude, html:station.direccion };
	var markers = new Array();
	markers.push( marker );
	$('#gas_mapa_div').gMap( {markers:markers, zoom:15});
}