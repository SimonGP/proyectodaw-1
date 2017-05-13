var session = false
function noExcursion(date){
var day = date.getDay();
// aqui indicamos el numero correspondiente a los dias que ha de bloquearse (el 0 es Domingo, 1 Lunes, etc...)
return [(day != 0 && day != 1 && day != 2 && day != 3 && day != 4 && day != 5), ''];
}

function calcularTiempo(minutos){
	var horas=Math.trunc(minutos/60);
	var minuto=minutos-horas*60;

	return (horas+"H "+minuto+"'")
	
}

function cargarRutas(){	
	
	$.ajax({
		url: 'rutas/php/panel_admin_verRutas.php',  

		type: 'POST',
		DataType:'Json',		
		success: function(data){ 
			var enlace=""
			$('#listado').html("")
			//enlace="<select id='listado'>"
			
			for(var x=0;x<data.length;x++){
								
				if(x==0){
					enlace+="<option selected='selected'>"					
				}else{
					enlace+="<option>"
				}				
				enlace +=data[x].nombre
				enlace+="</option>"
			}
			//enlace+="</select>"   			
			$('#listado').html(enlace)		
			var ruta=$('#listado').val()
				
			CargarRutaInicio(ruta)
			$('#lista').change(function(){	
			var ruta=$('#listado').val()				
			CargarRutaInicio(ruta)
								
			})			
		}		
	})
}


function CargarRutaInicio(ruta){	
	dato={
		ruta:ruta
	}
	$.ajax({
		data:dato,
		url: 'rutas/php/cargar_ruta_valor.php',  
		type: 'POST',
		DataType:'Json',		
		success: function(data){ 
			var id=data[0].id
				
			var tiempo=calcularTiempo(data[0].minutos)
			$('#id_ruta').val(data[0].id)
			$('#nombre_ruta').html(data[0].nombre)
			$('#localidad').html(data[0].localidad)
			$('#Tiempo').html(tiempo)
			$('#Distancia').html(data[0].km)
			$('#valoracion').html(data[0].valoracion)
			$('#Dificultad').html(data[0].dificultad)
			//$('#max_personas').html(data[0].max_res)
			$('#PDF').attr("href",(data[0].pdf))
			$('#PDF').attr("download",(data[0].nombre))
			$('#descripcion').html(data[0].consejos)
			$('#mapa').html(data[0].mapa)	
			dato={
				id:id
			}
			$.ajax({
				data:dato,
				url: 'rutas/php/calendario_una_ruta.php',
				type: 'POST',
				DataType: 'Json',
				success:function(data){
									
					$('#fechas_ruta').html("")
					enlace="<select id='listado_rutas'>"
					for(var x=0;x<data.length;x++){
						fecha=data[x].fecha2					
						fechax=fecha.split("-")			
						anio=fechax[0]
						mes=fechax[1]
						dia=fechax[2]			
						fecha2=dia+'/'+mes+'/'+anio					
						if(x==0){
							enlace+="<option selected='selected'>"					
						}else{
							enlace+="<option>"
						}				
						enlace +=fecha2
						enlace+="</option>"
					}
					enlace+="</select>"   			
					$('#fechas_ruta').html(enlace)
					var consulta=$('#datepicker').val()
					
					if(consulta!=undefined){
						
						$('#listado_rutas').val(consulta)
					}
				}
			})
		}
	})	
}


function cargarRutasFecha(){
	$('#localidad_busqueda').val("Todas")
	var fecha = $('#datepicker').val()
	console.log("def"+fecha)
	if (fecha == ""){
		
	}else{	
	
		var fechax=fecha.split("/")				
		var anio=fechax[2]
		var mes=fechax[1]
		var dia=fechax[0]			
		var fecha2=anio+'/'+mes+'/'+dia
		var dato={
			fecha:fecha2
		}
		
		$.ajax({
			data:dato,
			url: 'rutas/php/busqueda_fecha.php', 
			type: 'POST',
			DataType:'Json',	
			success: function(data){ 
			
				if(data[0].nombre=="vacio"){
						alert("No Hay rutas para esa fecha");
						cargarRutas()
				}else{			
					$('#lista').html("")
					enlace="<select id='listado'>"
					for(var x=0;x<data.length;x++){
										
						if(x==0){
							enlace+="<option selected='selected'>"					
						}else{
							enlace+="<option>"
						}				
						enlace +=data[x].nombre
						enlace+="</option>"
					}
					enlace+="</select>"   			
					$('#lista').html(enlace)		
						var ruta=$('#listado').val()				
						//CargarRutaInicio(ruta)
								
				}
				CargarRutaInicio(ruta)
			}
		})
	}
}

function cargarRutasLocalidad(){
	$('#datepicker').val("")
	console.log("dentro busqueda local")
	var local=$('#localidad_busqueda').val()
	var dato={
		localidad:local
	}
	$.ajax({
		data:dato,
		url:'rutas/php/localidad_ruta.php',
		type:'POST',
		DataType:'Json',
		success:function(data){
			$('#lista').html("")
			enlace="<select id='listado'>"
			for(var x=0;x<data.length;x++){
								
				if(x==0){
					enlace+="<option selected='selected'>"					
				}else{
					enlace+="<option>"
				}				
				enlace +=data[x].nombre
				enlace+="</option>"
			}
			enlace+="</select>"   			
			$('#lista').html(enlace)		
			var ruta=$('#listado').val()
				
			CargarRutaInicio(ruta)
		}
	})
}




$(document).ready(function(){
	$('#reset').click(reseteo)
	
	$('#rutero').click(annadir)
	$('#localidad_busqueda').change(cargarRutasLocalidad)
		var hoy= new Date()
			$.datepicker.regional['es'] = {
				closeText: 'Cerrar',
				prevText: '< Ant',
				nextText: 'Sig >',
				currentText: 'Hoy',
				monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
				monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
				dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
				dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
				dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
				weekHeader: 'Sm',
				dateFormat: 'dd/mm/yy',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''
			 }
			$.datepicker.setDefaults($.datepicker.regional['es'])
			$("#datepicker").datepicker({
				minDate: hoy,
				changeMonth:true,
				beforeShowDay: noExcursion,
			})
			$('#datepicker').change(cargarRutasFecha)
		$( "#tabs" ).tabs({
			collapsible: true
	})	
	cargarRutas()
	//CargarRutaInicio()
	
$('#guardar_Reserva').click(guardarReserva)

//comentario

	$('#botonreserva').click(function() {
		console.log($('#nombre_ruta').html())
		
		
				if($('#rutero').hasClass('ocultar')){
					$('#rutero').removeClass('ocultar')
				$('#rutero').addClass('mostrar')}
				if($('.acompanante').hasClass('ocultar')){
					$('.acompanante').removeClass('ocultar')
				$('.acompanante').addClass('mostrar')}
				if($('#listado_ruteros').hasClass('mostrar')){
					$('#listado_ruteros').removeClass('mostrar')
				$('#listado_ruteros').addClass('ocultar')}
				if($('#guardar_Reserva').hasClass('ocultar')){
					$('#guardar_Reserva').removeClass('ocultar')
				$('#guardar_Reserva').addClass('mostrar')}
		$.ajax({
			url:   'Usuarios/php/clase_sessiones.php',
            type:  'post',
			TypeData: 'Json',
			success:function(data){
				
				$('#nombrecompleto').html(data.nombre+" "+data.apellidos)
				$('#rutareserva').html($('#nombre_ruta').html())
				$('#DNIreserva').html(data.dni)
			}
		})
		type = $(this).attr('data-type');
		
		$('.overlay-container').fadeIn(function() {
			
			window.setTimeout(function(){
				$('.window-container.'+type).addClass('window-container-visible');
			}, 100);
			
		});
	});
	
	$('#close').click(cerrarPopUp);
	  
	function guardarReserva(){
		var id=$('#id_ruta').val()
		var fecha=$('#listado_rutas').val()
		var fechax=fecha.split("/")				
		var anio=fechax[2]
		var mes=fechax[1]
		var dia=fechax[0]			
		var fecha2=anio+'/'+mes+'/'+dia
		var nombre=$('#nombrecompleto').html()
		var dni=$('#DNIreserva').html()
		var mensaje="<p>"+nombre+" <b>"+dni+"</b></p>"
		var contador=1;
		var acompanantes=$('.compi')
		var dniacompa=$('.dnicompi')		
		for (var x=0;x<acompanantes.length;x++){
			mensaje+="<p>"+acompanantes[x].innerHTML+" <b>"+dniacompa[x].innerHTML+"</b></p>"
			contador++;
		}
		
		console.log(mensaje)
		datos={
			numero:contador,
			fecha:fecha2,
			id_ruta:id,
			reserva:mensaje
		}
		$.ajax({
			url: 'rutas/php/guardarReserva.php',
			data:datos,
			type: 'POST',
			DataType:'Json',		
			success: function(data){
				console.log(data)
				$('#guardar_Reserva').removeClass('mostrar')
				$('#guardar_Reserva').addClass('ocultar')
				$('#rutero').removeClass('mostrar')
				$('#rutero').addClass('ocultar')
				$('.acompanante').removeClass('mostrar')
				$('.acompanante').addClass('ocultar')
				
				$('#listado_ruteros').addClass('mostrar')
				
				var acompa=$('#listado_ruteros').html()
				acompa+="<p>"+data+"</p>"
				console.log("guardado"+acompa)
				$('#listado_ruteros').html(acompa)
					
			}
		})
	}
	
}	

function annadir(){
	if($('#nombre_rutero').val()== "" || $('#dni_rutero').val()==""){
		
	}else{
		
			$('#listado_ruteros').removeClass("ocultar")
			$('#listado_ruteros').addClass("mostrar")
		
		//$('#listado_ruteros').removeClass("ocultar")
		//$('#listado_ruteros').addClass("mostrar")
		var nombre=$('#nombre_rutero').val()
		var dni=$('#dni_rutero').val()
		
		var mensaje=$('#listado_ruteros').html()
		mensaje+="<p>Nombre: <span class='compi'>"+nombre+"</span></p><p>DNI: <span class='dnicompi'>"+dni+"</span></p><br><hr/>"
		$('#listado_ruteros').html(mensaje)
	}
	
}

function cerrarPopUp(){
		$('#listado_ruteros').removeClass("mostrar")
		$('#listado_ruteros').addClass("ocultar")
		$('#listado_ruteros').html("")
		$('#guardar_Reserva').removeClass('ocultar')
		$('#guardar_Reserva').addClass('mostrar')
		$('#rutero').removeClass('ocultar')
		$('#rutero').addClass('mostrar')
		$('.acompanante').removeClass('ocultar')
		$('.acompanante').addClass('mostrar')
		$('.overlay-container').fadeOut().end().find('.window-container').removeClass('window-container-visible');
	}
	
	function reseteo(){
		$('#datepicker').val("")
		$('#localidad_busqueda').val("Todas")
		cargarRutas()
		cargarRutaInicio($('#listado').val())
	}