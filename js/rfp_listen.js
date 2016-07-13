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
        <a id="queue-toggle"></a>
        <div id="rfp-queue">We are the queue.... <a id="queue-toggle-inqueue"></a></div>
		<div id="rfp-recording-cover"></div>
		<div id="rfp-track-details">

		 <h1 id="rfp-track-title" ></h1>
		 <h2><span id="rfp-track-recording-name"></span> - <span id="rfp-track-artist-name"></span></h2>
         <div id="TODO">
		 <br/>

		 <br>
[  TODO: add a hover hilight to queue tracks, and add one to make a hover transparency effect for the queue show button  ]

		 [ TODO:  Modes:  track, recording, artist, playlist, shuffle ]
         <br>
         [ TODO: Playlists:  add, reorder, edit + tag, delete, promote ]
         <br>
         [ TODO: Should allow user to download recording if it is a freebie ]
         <br>
         [ TODO: fix line heights in queue for long album names (like PW burnt by the sun scared by the thunder) ]
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
               this.queue_index = 0;
               var parent = this;
               // Hide / Show Queue
                $('#queue-toggle').click( parent.queuetoggle );

                // set the image for the queue show button
                var i = document.createElement( 'img' );
                i.src = drupalSettings.rfplisten.images.queueshow;
                $(i).css( 'width', '40px' );
                $(i).css( 'height', '40px');
                $(i).css( 'margin', '5px');
                $('#queue-toggle').append( i );



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

                   // parent.queue = JSON.parse( data );
                    parent.reset_queue( JSON.parse( data ));
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
                else {

                    this.queue_index = next_index;
                }

                return this.queue[ next_index ];
            },

            queuetoggle: function( ) { // Show or hide the queue

                $('#rfp-queue').animate( {'width': 'toggle' }, 170  );
            },

            // Overwrite the existing queue - then load up the first track in the queue
            reset_queue: function( newqueue ) {

                this.queue = newqueue;

                $('#rfp-queue').empty();

				// Add back the close button..
				var queuetoggle = $('A#queue-toggle' ).clone( true );
				queuetoggle.className = 'rfp-in-queue-toggle';
				$(queuetoggle).css( 'position', 'relative' );

				$(queuetoggle).css( 'left', '15px' );
				$(queuetoggle).text( '[ X ]' );

				$('#rfp-queue').append( queuetoggle );

                // And the grippie
                var grippie = document.createElement( 'div' );
                $(grippie).attr( 'id', 'rfp-queue-grippie');
                $('#rfp-queue').append(grippie);
                $('#rfp-queue-grippie').css( 'cursor', 'pointer' );
                //$('#rfp-queue-grippie').click( function() { $('#rfp-queue-grippie').hide();  $('#rfp-queue').slideToggle( 600 ); } );
                $('#rfp-queue-grippie').click( this.queuetoggle );

                var tracks = document.createElement('ul');
				tracks.className = 'rfp-queue-tracks';

                var counter = 0;

                for( var t in this.queue ) {

                    var parent = this;
                    var track = document.createElement('li');
                    tracks.appendChild( track );

					var trackid = 'track_' + this.queue[t].nid + '_in_position_' + counter;
                    track.setAttribute( 'id', trackid );
					track.className += 'rfp-queue-track';

					var title = this.queue[t].title;
					// Truncate long titles..
					if( title.length > 45 ) {
						title = title.substring( 0, 45 ) + '...';
					}


                    track.innerHTML = '<img  id="' + trackid + '" src="' + this.queue[t].recording_cover
                        + '" alt="' + this.queue[t].artist_name + '" class="queue-thumb"/>';

                    track.innerHTML += '<div id="queue-track-details">' +
					  '<span class="queue-details rfp-track-title"><h3>' + title + '</h3></span>' +
					  '<span class="queue-details rfp-recording-title"><h3>' + this.queue[t].recording_title + '</h3></span>' +
					  '<span class="queue-details rfp-track-artist">' + this.queue[t].artist_name + '</span></div>';

                    track.class = 'rfp-queue-track';
                    track.position = counter;

                    parent = this;

					$(track).on( 'click', function() {

						var id = $(this).attr('id');
						var id_chunks = id.split( '_');
						var nid = id_chunks[1];
						var pos = id_chunks[4];

                        console.log( "Have " + pos + " vs " + parent.queue_index );

                        if( pos == parent.queue_index ) { return; } // do nothing if we click on the current track

						window.rfp.queue_skip_to( pos );
					});

                    ++counter;
                }

                $('#rfp-queue').append( tracks );

                // reset the now playing hilight
                this.reset_queue_hilight();
            },

            reset_queue_hilight: function() {

                var track_counter   = 0;
                var parent          = this;
                var q = $( '#rfp-queue');

                $('.rfp-queue-track').each( function( index, thistrack ) {

                    $(thistrack).removeClass( 'queue-current-track' );

                    if( track_counter == parent.queue_index ) {

                        $(thistrack).addClass( 'queue-current-track' );


                       // $(q).scrollTop( $(thistrack).height() * parent.queue_index );
                        $(q).animate( {
                            scrollTop: $(thistrack).height() * parent.queue_index

                        }, 300 );



                    }

                    ++track_counter;
                });
            },

            // Skip ahead / behind in the queue by array index (zero based)
            queue_skip_to: function( to ) {

                // Force bounds
                if( to < 0 ) { to = 0; }
                if( to > this.queue.length - 1 ) { to = this.queue.length - 1; }

                var was_playing = this.playing;

				this.playing = 0;
                this.queue_index = to;
                this.reset_queue_hilight();
                this.play_queue();
                this.resetButtonBar();

                if( was_playing == 1 ) {

                    this.playtoggle();

                  // this.playing = 1;
                  // document.getElementById( 'rfp-hidden-player' ).play();

                }
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

			playtoggle: function() {

			  if( this.playing == 1 ) {

				this.playing = 0;
				this.pause();
			  }
			  else {

				this.playing = 1;
				this.play();
			  }
			},

			play: function() {
			  	document.getElementById( 'rfp-hidden-player' ).play();
                $('#rfp-play').hide();
                $('#rfp-pause').show();
			},

			pause: function() {
			  	document.getElementById( 'rfp-hidden-player' ).pause();

                $('#rfp-pause').hide();
                $('#rfp-play').show();
			},

            prev_track: function() {

                if( ! $('#rfp-prev').hasClass( 'disabled' )) {
                      this.queue_skip_to( this.queue_index - 1 );
                      if( this.playing ) {
                       //  document.getElementById( 'rfp-hidden-player' ).play();
                     }
                }
            },
            next_track: function() {

                 if( ! $('#rfp-next').hasClass( 'disabled' )) {

                     this.queue_skip_to(Number(this.queue_index) + 1);
                     if( this.playing ) {
                        // document.getElementById( 'rfp-hidden-player' ).play();
                     }
                }
            },

            resetButtonBar: function() {

                $('#rfp-buttonbar' ).empty();


                // Play Button..
                var play_img = document.createElement('img');
                play_img.src = drupalSettings.rfplisten.images.play;

                var play_btn = document.createElement('a');
                play_btn.appendChild( play_img );
                play_btn.className += ' play-pause';
                play_btn.addEventListener( 'click', function() { window.rfp.playtoggle(); } );
                $(play_btn).attr( 'id', 'rfp-play' );

                // Pause Button..
                var pause_img = document.createElement('img');
                pause_img.src = drupalSettings.rfplisten.images.pause;

                var pause_btn = document.createElement('a');
                pause_btn.appendChild( pause_img );
                pause_btn.className += ' play-pause';
                pause_btn.addEventListener( 'click', function() { window.rfp.playtoggle(); } );
                $(pause_btn).attr( 'id', 'rfp-pause' );

                $(pause_btn).hide();

                // Next / Prev Track Buttons..
                var next_img = document.createElement('img');
                next_img.src = drupalSettings.rfplisten.images.next;
                var next_btn = document.createElement('a');
                next_btn.appendChild( next_img );
                next_btn.className += ' next-prev';
                next_btn.addEventListener( 'click', function() { window.rfp.next_track(); } );
                $(next_btn).attr( 'id', 'rfp-next' );


                var prev_img = document.createElement('img');
                prev_img.src = drupalSettings.rfplisten.images.prev;
                var prev_btn = document.createElement('a');
                prev_btn.appendChild( prev_img );
                prev_btn.className += ' next-prev';
                prev_btn.addEventListener( 'click', function() { window.rfp.prev_track(); } );
                $(prev_btn).attr( 'id', 'rfp-prev' );

                // Soften them up a bit
                var nextprevfade = 0.6;
                $( prev_btn ).fadeTo( 0, nextprevfade );
                $( next_btn ).fadeTo( 0, nextprevfade );

                // Hide them if we don't need them
                if( this.queue_index == 0 ) {

                    $( prev_btn ).fadeTo( 0, 0 );
                    $( prev_btn ).addClass( 'disabled' );
                }

                if( this.queue_index == this.queue.length - 1 ) {

                    $( next_btn ).fadeTo( 0, 0 );
                    $( next_btn ).addClass( 'disabled' );
                }

                $('#rfp-buttonbar').append( prev_btn  );
                $('#rfp-buttonbar').append( play_btn  );
                $('#rfp-buttonbar').append( pause_btn );
                $('#rfp-buttonbar').append( next_btn  );
            },
        },

        accessors:  {

            queue_index:        { attribute: {} },
			playing:            { attribute: {} },
            artists_by_nid:     { attribute: {} },
            artists_by_title:   { attribute: {} },
        }
	   });
	});


} ) ( jQuery, Drupal, drupalSettings );
