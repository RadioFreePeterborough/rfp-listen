/* Set up the RFP Listener Page Widgets */
( function($) {
   
    $(document).ready( function() { 
                   
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
            
               var mode = drupalSettings.rfplisten.mode;
               
               if( drupalSettings.rfplisten.debug == 1 ) {
               
                console.log('begin init in mode ' + mode );
                   
               }
               
               
               
               var parent = this;
               //$.getJSON( 
               
               
                //this.artists_by_nid     = new Array();
                //this.artists_by_name    = new Array();
               // this.recordings 	 	= new Array();
                
                //var tracks = new Array();
                //this.tracks = [ ];
                
                // Load the tracks from the static data source
                
               
               
               
               /*
    
                // Build our data
                var artists = drupalSettings.rfplisten.artists[ 'artists' ];
            
                for( var artistIndex in artists ) {
                  
                    var name = artists[ artistIndex ]['name'];
                    var nid  = artists[ artistIndex ]['nid'];
                    
                    this.artists_by_nid[ nid ]   = name;
                    this.artists_by_name[ name ] = nid;
                }
                
                var tracks = [];
                var track_count = Object.keys( drupalSettings.rfplisten.tracks ).length;
                var random_track = Math.floor( Math.random() * Object.keys( drupalSettings.rfplisten.tracks ).length );
                var init_track = null;
                        
                for( var trackIndex in drupalSettings.rfplisten.tracks ) {
                          
                  var t = {}; 
                  t.trackname       = drupalSettings.rfplisten.tracks[trackIndex]['title'];
                  t.tracknid        = drupalSettings.rfplisten.tracks[trackIndex]['nid'];
                  t.track_num       = drupalSettings.rfplisten.tracks[trackIndex]['track_number'];
                  t.track_mp3       = drupalSettings.rfplisten.tracks[trackIndex]['mp3'];
                  t.recording_nid   = drupalSettings.rfplisten.tracks[trackIndex]['recording'];
                  t.recording_title = drupalSettings.rfplisten.tracks[trackIndex]['recording_title'];
                  t.recording_cover = drupalSettings.rfplisten.tracks[trackIndex]['recording_cover'];
                  t.artist_nid 	    = drupalSettings.rfplisten.tracks[trackIndex]['artist_nid'];
                  t.artist_name     = drupalSettings.rfplisten.tracks[trackIndex]['artist_name'];
                  
                  if( !t.recording_nid || !t.artist_nid ) { continue; }
                  
                  tracks.push( t );
                  
                  if( trackIndex == random_track ) {
                      init_track = t.tracknid;   
                  }	
                }
                        
                this.tracks = tracks;
                        
                // initialize the player 
                this.setTrack( init_track );
                
                */
                
                window.rfp = this;
               
                this.resetButtonBar();
               
               
             
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
                
            
                
                
                
                
                
                
                /*
                var a = document.createElement('a');
var linkText = document.createTextNode("my title text");
a.appendChild(linkText);
a.title = "my title text";
a.href = "http://example.com";
document.body.appendChild(a);
                */
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
					  
            play: function( ) { 
                
                // play a track    
            },
            pause: function( ) { 
            
            },
            setTrack: function( id ) {
                
                this._fetch_track( id ); 
				
            },
            setArtist: function( id ) {
                
            },
            setRecording: function( id ) {
                
            },
            
            // For future use..
            setPlaylist: function( id ) { 
                
            },
            
            _fetch_track: function( id ) {  // Load our track info..
                
                this.currentTrackId = id;
                
                var data_path = drupalSettings.rfplisten.datasource_tracks + id.toString() + '.json';
                var parent = this;     
                $.getJSON(data_path, function( json ) {
                        parent._init_track( json );
                });                    
            },
            
            _init_track( track_json ) {
            
                this.currentTrack = track_json;
                this.currentTrackId = track_json.nid;
                this.showCurrentTrack();
            },
			random_track() { 
			  
				var track_count = Object.keys( drupalSettings.rfplisten.tracks ).length;
				var random_track = Math.floor( Math.random() * Object.keys( drupalSettings.rfplisten.tracks ).length );
			
				for( var trackIndex in drupalSettings.rfplisten.tracks ) {
			  
					if( random_track == trackIndex ) {
					    return drupalSettings.rfplisten.tracks[trackIndex];
							
					}  
				}
			},
					  
            getTrack: function(id) {
                console.log( 'ready to grab track ' + id );   
            },
            
            getArtist: function(id, withtracks) {
                console.log( 'get artist ' + id  + ' if withrtracks ( ' + withtracks + ' ) is set, add track data' );
                
            },     
        },
           
        accessors:  {
            
            artists_by_nid:    { attribute: {} },
            artists_by_title:  { attribute: {} },
                                
            tracks:     { attribute: {}, get:function() {  }, set:function() {  } },
            recordings: { attribute: {} },
         
            playing: {
                attribute: {},
                get:function() {  },
                set:function( is_playing ) {  }
            },
            tracks: { attribute: {}  },
            currentTrack: {
                attribute: {},
                set: function( value ) { 
                    this.xtag.data.currentTrack = value;
                    
                },
                get: function( ) { return this.xtag.data.currentTrack; } 
            },
 
           currentTrackId: {
                attribute: {},
                get:function() {  },
               
                set:function( id ) {  }
           },
           currentTrackName: { 
                attribute: {},
                get:function() { return this.currentTrackName; },
                set:function( name ) { this.currentTrackName = name; }
           }
        }
	   });
	
	});  	
	
	
    document.rand_test = function() {
     
         var track = window.rfp.random_track();
	  
          window.rfp.currentTrack = track;
          window.rfp.currentTrackId = track.nid;
          window.rfp.showCurrentTrack();
    }
    
    document.play_test = function() {
       
		document.getElementById( 'rfp-hidden-player' ).play();
    }
    
	
	
	

	
	
	
} ) ( jQuery, Drupal, drupalSettings );


document.addEventListener('DOMComponentsLoaded', function(){

  	// Random Track Test
	jQuery('#randtest').click( function(  ) {  
	  
	  var track = window.rfp.random_track();
	  
	  window.rfp.currentTrack = track;
	  window.rfp.currentTrackId = track.nid;
	  window.rfp.showCurrentTrack();
	}); 
	
		// Random Track Test
	jQuery('#playtest').click( function(  ) {  
	
		//  jQuery('#rfp-hidden-player').play();
		var player = document.getElementById( 'rfp-hidden-player' );
		
		//console.log("Ready to play test on player " + player );
		player.play();
	  
	});
	
	
	
}, false);









