/*global document: false */
/* Set up the RFP Listener Page Widgets */
    
document.spinner_opts =  {
    lines: 11, // The number of lines to draw
    length: 10, // The length of each line
    width: 16, // The line thickness
    radius: 42, // The radius of the inner circle
    scale: 0.75, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#000', // #rgb or #rrggbb or array of colors
    opacity: 0.25, // Opacity of the lines
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    position: 'absolute' // Element positioning
};

document.spinner = new Spinner(document.spinner_opts).spin(document.body);
    

(function ($) {
   
    $(document).ready( function() { 
        
       'use strict';  
        
	   xtag.register( 'rfp-listen',  {
		 
		lifecycle: { 
		  
			created: function() { 
                
                $('#loading').hide(); // hide the loading message
                
                if( drupalSettings.rfplisten.debug == 1 ) {
				  
                   // console.log("DEBUG MODE");   
                }
                else { // hide the debug message..
                    
                    $('#debug').hide();  
                }
                
                this.init( );   	
			}
		},
		content: function() { 
		 /*
			<audio controls id="rfp-hidden-player" style="display: none;">
				Your browser does not support the audio element.
			</audio>
       <div id="rfp-wrapper"> 
		<div id="rfp-recording-cover"></div>
		<div id="rfp-track-details">

		 <h1 id="rfp-track-title" ></h1>
		 <h2><span id="rfp-track-recording-name"></span> - <span id="rfp-track-artist-name"></span></h2>
         <div id="TODO">
		 <br/>
         [ TODO: crossfade between old cover and new??? ] 
         
		 [ TODO :  Play, Pause, Next Track, Prev Track ]
		 <br>
		 [ TODO:  Modes:  track, recording, artist, playlist, shuffle ] 
         <br>
         [ TODO: Playlists:  add, reorder, edit + tag, delete, promote ]  
         <br>
         [ TODO: Should allow user to download recording if it is a freebie ] 
         <br> 
         [ TODO: If possible, allow popout player ] 
         <br>
         [ TODO: If possible, decouple player so it can be ported to LCMP ]
         </div>
         
	  </div>
      
	  <div style="clear: both;"></div>
      <div id="rfp-buttonbar"></div>		 

 
    </div> <!-- end wrapper -->
		 */
		},
        methods: {
         
           init: function() { 
               
               window.rfp = this;
               var mode = drupalSettings.rfplisten.mode;
               this.queue = []; // our central playback queue - only holds node ids 
               
               switch( mode ) {
                       
                    case 'random':
                    default: 
                        this.init_random_mode();
                       
               }
               
               this.resetButtonBar();
			},
             
            init_random_mode: function() {
                
                // grab 25 random songs 
                var data_path = drupalSettings.rfplisten.datasource_random_tracks;
                parent = this;
                
                $.get( data_path + '25',  function( data ) { 
                    
                    parent.queue = JSON.parse( data );
                    parent.queue_index = 0;
                    
                    document.spinner.stop(); 
                    parent.play_queue(); 
                });
            },
            play_queue: function() {
                
                var t = this.queue[ this.queue_index ];
                this._init_track( t );
            },
            
            queue_next_track: function() {
             
                var next_index = parseInt( this.queue_index ) + 1;
                
                // is there a next track?  if not, start over...
                if( next_index > this.queue.length - 1 ) {
                
                    this.queue_index = next_index = 0;
                }
                
                return this.queue[ next_index ];  
            },
            
            
            
            
           
            
            // Overwrite the existing queue - then load up the first track in the queue
            resetQueue: function( newqueue ) {
                
            },
            // Skip ahead / behind in the queue 
            queueSkipTo: function( address ) {
                
                // TODO - ensure we have enough queue entries to accommodate this request
            },
           
            		  
			showCurrentTrack: function() {
                
                $('#TODO').hide();
                
                
                var opts = {
                  lines: 11 // The number of lines to draw
                , length: 10 // The length of each line
                , width: 16 // The line thickness
                , radius: 42 // The radius of the inner circle
                , scale: 0.75 // Scales overall size of the spinner
                , corners: 1 // Corner roundness (0..1)
                , color: '#000' // #rgb or #rrggbb or array of colors
                , opacity: 0.25 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 1 // Rounds per second
                , trail: 60 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: 'spinner' // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: true // Whether to render a shadow
                , hwaccel: true // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
                }
			    var target = document.getElementById('rfp-wrapper')
                document.spinner = new Spinner(opts).spin(target);
                
                $('#rfp-track-details').hide();
				$('#rfp-track-title').text( this.currentTrack.title );
				$('#rfp-track-artist-name').text( this.currentTrack.artist_name );
				$('#rfp-track-recording-name').text( this.currentTrack.recording_title );

				var player = document.getElementById( 'rfp-hidden-player' );
				player.setAttribute( 'src', this.currentTrack.mp3 );
				
                // Preserve the dimensions so it doesn't squash over the track details
                var w = $('#rfp-recording-cover').css( 'width' );
                var h = $('#rfp-recording-cover').css( 'height' );
                
				$('#rfp-recording-cover').empty();
                 
                var cover = document.createElement("IMG");
                cover.addEventListener( 'load', function() { 
                    
                    document.spinner.stop();
                    $(cover).fadeIn();
                    $('#rfp-track-details').fadeIn( );
                    $('#TODO').show();
                    
                }, false );
                
                cover.src =  this.currentTrack.recording_cover;    
                $(cover).css( 'display', 'none' );
                
				jQuery('#rfp-recording-cover').append( cover );
  
            },
				 
            _fetch_track: function( id ) {  // Load our track info..
                
                this.currentTrackId = id;
                
                var data_path = drupalSettings.rfplisten.datasource_tracks + id.toString() + '.json';
                var parent = this;     
                $.getJSON(data_path, function( json ) {
                        parent._init_track( json );
                });                    
            },
            
            _init_track: function( track_json ) {
            
                this.currentTrack = track_json;
                this.currentTrackId = track_json.nid;
                this.showCurrentTrack();
            },
            
            resetButtonBar: function() {
         
                // Random Track
                var rand = document.createElement( 'a' );
                var linkText = document.createTextNode( 'Random Track' );
                rand.appendChild(linkText);
                rand.addEventListener( 'click', function() { document.rand_test(); } );
                 
                $('#rfp-buttonbar').append( rand  );
                
                // Play 
                var play = document.createElement( 'a' );
                var linkText = document.createTextNode( 'Play Track' );
                play.appendChild( linkText );
                play.addEventListener( 'click', function() { document.play_test(); } );
                
                $('#rfp-buttonbar').append( play );
                
                // Dump queue 
                var dump_q = document.createElement( 'a' );
                var linkText = document.createTextNode( 'Dump Queue' );
                dump_q.appendChild( linkText );
                
                dump_q.addEventListener( 'click', function() { document.qump_queue(); } );
                
                $('#rfp-buttonbar').append( dump_q );
                
                
                
                
                
            },
            
		
        },
            
       
            
           
        accessors:  {
            
            queue_index: { attribute: {} },
            
            artists_by_nid:    { attribute: {} },
            artists_by_title:  { attribute: {} },
            
        }
	   });
	
	});  	
	
	
    document.rand_test = function() {
     
         //var track = window.rfp.random_track();
         var track = window.rfp.queue_next_track();
	  
          window.rfp.currentTrack = track;
          window.rfp.currentTrackId = track.nid;
          window.rfp.showCurrentTrack();
    }
    
    document.play_test = function() {
       
		document.getElementById( 'rfp-hidden-player' ).play();
    }
    
    document.qump_queue = function() {
     
        console.log( 'dumping queue...');
        for( var t in window.rfp.queue ) {
         
            console.log( "Q FILE: " + window.rfp.queue[t].title );
        }
        
        
        
    }
	
	
	

	
	
	
} ) ( jQuery, Drupal, drupalSettings );










