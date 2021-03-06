/*global document: false */
/*global Spinner: false */


/* Set up the RFP Listener Page */

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
    top: '38%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: true, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    position: 'absolute' // Element positioning
};

document.spinner = new Spinner(document.spinner_opts).spin(document.body);

(function ($) {

  /*  'use strict'; */
    $(document).ready(function () {

	  document.title = 'Radio Free Peterborough';

    xtag.register( 'rfp-listen',  {

		lifecycle: {

			created: function() {

				  // Add event handler for player - if it gets to the end of the track, switch to next
				  $('#rfp-hidden-player').on( 'ended', function() {

						var next_index = Number(window.rfp.queue_index) + 1;
						if( next_index > window.rfp.queue.length - 1 ) { next_index = 0; }
						window.rfp.queue_skip_to( next_index );
				  });

				  // Keydown handlers..
				  $(document).keydown( function ( data ) {

						if( event.which == 37 ) { // left arrow

							var next_index = Number(window.rfp.queue_index) - 1;
							if( next_index >= 0 ) { // we are not on the first track

								window.rfp.queue_skip_to( next_index );
							}
						}
						if( event.which == 39 ) { // right arrow

						  var next_index = Number(window.rfp.queue_index) + 1;
						  if( next_index < window.rfp.queue.length )  {
                window.rfp.queue_skip_to( next_index );
						  }
						}
						if( event.which == 27 ) { // escape

						  if( $('#rfp-queue').is( ':visible' )) {
                window.rfp.queuetoggle();
						  }
						  if( $('#rfp-search').is( ':visible' )) {
                window.rfp.searchtoggle();
						  }
              if( $('#rfp-ukulele').is( ':visible')) {
                window.rfp.uketoggle();
              }
              if( $('#rfp-info').is( ':visible')) {
                window.rfp.infotoggle();
              }

						}
            if( event.which == 13 ) { // enter - if search is open, submit it

              if( $('#rfp-search').is( ':visible' )) {
                window.rfp.rfp_search();
						  }
            }
				  });

				  $('#loading').hide(); // hide the loading message
				  this.init();
			}
		},
		content: function() {
		 /*
      <audio controls id="rfp-hidden-player" style="display: none;">
      Your browser does not support the audio element.
      </audio>
      <div id="rfp-wrapper">
        <a id="queue-toggle" title="Show the playlist"></a>
        <a id="search-toggle" title="Search the catalogue"></a>
        <a id="uke-toggle" title="Every possible Ukulele Chord for soprano and baritone ukulele, both left and right handed. For free."></a>
        <a id="info-toggle" title="About Radio Free Peterborough"></a>
        <a id="rfp-apps" href="/apps" title="Free Mobile Apps - put some Peterborough in your pocket!" target="_blank"></a>
        <div id="rfp-ukulele"></div>
        <div id="rfp-queue"><a id="queue-toggle-inqueue"></a></div>
        <div id="rfp-search"><a id="search-toggle-insearch"></a></div>
        <div id="rfp-info"></div>

        <div id="rfp-recording-cover"></div>
          <div id="rfp-track-details">
            <h1 id="rfp-track-title" ></h1>
            <h2><span id="rfp-track-recording-name"></span><span id="dash"> - </span> <span id="rfp-track-artist-name"></span></h2>
            <div id="like-button-holder"></div>

            <div id="unsupported"  >
            <small>Sorry, it looks like your browser won't load this website for some reason.  Try updating your browser?</small>
          </div>
      </div>
      <div id="rfp-buttonbar"></div>
      </div> <!-- end wrapper -->
		 */
		},
        methods: {

           init: function() {

              $('#unsupported').hide();
              window.rfp = this;

      			  var mode = this.get_url_param( 'mode' );
      			  var id   = Number( this.get_url_param( 'id' ));

      			  if( !mode ) { mode = 'random'; }
      			  if( !id || id === 'NaN'  ) id = 0;

              this.queue = []; // our central playback queue - only holds node ids
              this.queue_index = 0;
              this.mode = mode;
              this.id = id;

              // Remove the homepage link from the logo if we are already on the homepage
              if( $('BODY').hasClass( 'path-frontpage' ) && !this.mode ) {

                  $('.site-branding__logo-link').removeAttr('href');
                  $('.site-branding__logo-link').css( 'cursor', 'default' );
              }


              /*

                Sidebar buttons

              */

              // Hide / Show Queue
              $('#queue-toggle').click( window.rfp.queuetoggle );

              // set the image for the queue show button
              var i = document.createElement( 'img' );
              i.src = drupalSettings.rfplisten.images.queueshow;
              $(i).css( 'width', '40px' );
              $(i).css( 'height', '40px');
              $(i).css( 'margin', '5px');

              $('#queue-toggle').append( i );

              // Hide / Show search interface
              $('#search-toggle').click( window.rfp.searchtoggle );
              // set the image for the queue show button
              var i = document.createElement( 'img' );
              i.src = drupalSettings.rfplisten.images.searchshow;
              $(i).css( 'width', '40px' );
              $(i).css( 'height', '40px');
              $(i).css( 'margin', '5px');
              $('#search-toggle').append( i );

              // Hide / Show Ukulele
              $('#uke-toggle').click(  window.rfp.uketoggle );
              i = document.createElement( 'img' );

              i.src = drupalSettings.rfplisten.images.ukeshow;
              $(i).css( 'width', '50px' );
              $(i).css( 'height', '50px');

              $('#uke-toggle').append( i );

              // Hide / Show info
              $('#info-toggle').click( window.rfp.infotoggle );
              i = document.createElement( 'img' );

              i.src = drupalSettings.rfplisten.images.infoshow;
              $(i).css( 'width', '35px' );
              $(i).css( 'height', '35px');

              $('#info-toggle').append( i );

              // Apps link
              i = document.createElement( 'img' );

              i.src = drupalSettings.rfplisten.images.appshow;
              $(i).css( 'width', '28px' );
              $(i).css( 'height', '28px');

              $('#rfp-apps').append( i );

              this.reset_button_bar();

              switch( mode ) {

                case 'artist':
                  this.init_artist_mode( id );
                  break;

                case 'recording':
                  this.init_recording_mode( id );
                  break;

                case 'track':
                  this.init_track_mode( id );
                  break;

                case 'random':
                default:
                  this.init_random_mode();
              }

      		},

          init_random_mode: function() {

                // grab 25 random songs
                var data_path  = drupalSettings.rfplisten.datasource_random_tracks;
				        var rand_count = drupalSettings.rfplisten.datasource_random_tracks_count;

                $.get( data_path + rand_count,  function( data ) {

                    window.rfp.reset_queue( JSON.parse( data ));
                    window.rfp.queue_index = 0;
                    document.spinner.stop();
                    window.rfp.play_queue();
                });
            },
            init_artist_mode: function( artist_id ) {

            	  // Get recordings that match this artist..
            	  var data_path = drupalSettings.rfplisten.datasource_artist  + artist_id;

            	  $.get( data_path,  function( data ) {

              		 var tracks = JSON.parse( data );
              		 if( tracks.length == 0 ) {
              			  alert('We were unable to find an artist matching that id - switching back to random mode');

              			  document.location = '/';
              			  return;
              		 }

                    window.rfp.reset_queue( tracks );
                    window.rfp.queue_index = 0;
                    document.spinner.stop();
                    window.rfp.play_queue();
                });
            },

            init_recording_mode: function( recording_id ) {

      				// Can we get this recording?
      				var recording_url = drupalSettings.rfplisten.datasource_recordings_by_id + recording_id + '.json';

      				$.getJSON( recording_url, function (recording_data) {

      					var tracks_url = drupalSettings.rfplisten.datasource_tracks_by_recording + recording_id + '.json';
      					$.getJSON( tracks_url, function( tracks ) {

      					  var recording_tracks = [];

      					  for ( var t in tracks ) {

        						if( !tracks[t].title ) { continue; }
        						recording_tracks.push( tracks[t] );
      					  }

      					  window.rfp.reset_queue( recording_tracks);
      					  window.rfp.queue_index = 0;
      					  document.spinner.stop();
      					  window.rfp.play_queue();

      					}).fail( function() {
      						alert("Sorry - we were unable to find any tracks for that recording - Initializing in random mode instead.");
      						window.rfp.init_random_mode();
      					});
      				})
      				.fail( function() {
      					alert("Sorry - we were unable to find a recording with that id. Initializing in random mode instead.");
      					window.rfp.init_random_mode();
      				});
            },

      			init_track_mode: function( track_id ) {

      			  var track_url = drupalSettings.rfplisten.datasource_tracks + track_id + '.json';

      			  $.getJSON( track_url, function( track ) {

      				  var tracks_url = drupalSettings.rfplisten.datasource_tracks_by_recording + track.recording + '.json';

                $.getJSON( tracks_url, function( tracks ) {

      					  var recording_tracks = [];
      					  var counter = 0;
      					  for ( var t in tracks ) {

        						if( !tracks[t].title ) { continue; }
        						if( tracks[t].nid == track.nid ) {   // If this is our desired track, set queue index to match
        						  window.rfp.queue_index = counter;
        						}

        						recording_tracks.push( tracks[t] );
        						++counter;
      					  }

      					  window.rfp.reset_queue( recording_tracks);

      					  document.spinner.stop();
      					  window.rfp.play_queue();
      					  window.rfp.reset_queue_hilight();
      					  window.rfp.reset_button_bar();

      					}).fail( function() {
      						alert("Sorry - we were unable to find any tracks for that recording - Initializing in random mode instead");
      						window.rfp.init_random_mode();
      					});
      			  }).fail( function() {
      					alert("Sorry - we were unable to find a track with that id. Initializing in random mode instead");
      					window.rfp.init_random_mode();
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
			  window.rfp.reset_queue_hilight();
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
                $(queuetoggle).empty();
                $(queuetoggle).attr( 'title', 'Close the playlist' );

                var qtimg = document.createElement( 'img' );
                qtimg.src = drupalSettings.rfplisten.images.queuehide;

                $(qtimg).css( 'width', '35px').css( 'height', '35px' );
                $(queuetoggle).append( qtimg );

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

                    var track = document.createElement('li');
              			var trackid = 'track_' + this.queue[t].nid + '_in_position_' + counter;
                    var title = this.queue[t].title;
          					if( !title ) continue; // Ignore blank titles

                    track.setAttribute( 'id', trackid );
              			track.className += 'rfp-queue-track';
                    tracks.appendChild( track );

                    // Truncate long titles..
                    if( title.length > 45 ) {
                    				title = title.substring( 0, 45 ) + '...';
                    }

                    track.innerHTML = '<img  id="' + trackid + '" src="' + this.queue[t].recording_cover
                        + '" alt="' + this.queue[t].artist_name + '" class="queue-thumb"/>';

                    track.innerHTML += '<div id="queue-track-details">' +
                      '<span class="queue-details rfp-track-title"><h3>' + title + '</h3></span>' +
                      '<span class="queue-details rfp-recording-title"><h3>' + this.queue[t].recording_title + ' - ' + this.queue[t].artist_name   + '</h3></span>';

                    track.class     = 'rfp-queue-track';
                    track.position  = counter;

                    $(track).on( 'click', function() {

                    	var id = $(this).attr('id');
                    	var id_chunks = id.split( '_');
                    	var nid = id_chunks[1];
                    	var pos = id_chunks[4];

                      if( pos == window.rfp.queue_index ) { return; } // do nothing if we click on the current track
                    	window.rfp.queue_skip_to( pos );
                    });

                    $(track).hover( function() {

                    	var id = $(this).attr('id');
                    	var id_chunks = id.split( '_');
                    	var nid = id_chunks[1];
                    	var pos = id_chunks[4];
                    	if( pos != window.rfp.queue_index ) {  // don't hilight the current track
                    		  $(this).addClass( 'queue-track-hover' );
                    	   }
                      },
                      function() {
                    	   $(this).removeClass( 'queue-track-hover' );
                        }
                      );

                    ++counter;
                  }

                  $('#rfp-queue').append( tracks );
                  this.reset_queue_hilight();
            },

            reset_search: function() {

                $('#rfp-search').empty();

                // Add back the close button..
        				var searchtoggle = $('A#search-toggle' ).clone( true );
        				searchtoggle.className = 'rfp-in-search-toggle';
        				$(searchtoggle).css( 'position', 'relative' );
        				$(searchtoggle).css( 'left', '15px' );
                $(searchtoggle).css( 'top', 0 );

                $(searchtoggle).empty();
                $(searchtoggle).attr( 'title', 'Close the search box' );

                var qtimg = document.createElement( 'img' );
                qtimg.src = drupalSettings.rfplisten.images.searchhide;

                $(qtimg).css( 'width', '35px').css( 'height', '35px' );
                $(searchtoggle).append( qtimg );

        		    $('#rfp-search').append( searchtoggle );

                var searchtitle = document.createElement( 'h2');
                searchtitle.innerHTML = 'Search';
                searchtitle.className = 'search-title';

                //  Add our search interface
                var search_html = '<div id="rfp-search-wrapper">'
                + '<select id="rfp-search-for">'
                  + '<option value="artist">  Search by Artist Name</option>'
                  + '<option value="recording">  Search by Recording Title</option>'
                  + '<option value="track">  Search by Track Title</option>'
                + '</select>'
                + '<h3 class="search-label">Search Keywords:</h3>'
                + '<input type="text" id="rfp-search-keywords">'
                + '<input type="submit" id="rfp-search-submit" onclick="window.rfp.rfp_search()" value="Search" >';

                // And a div to hold it for easier styling
                var searchbydiv = document.createElement( 'div' );
                searchbydiv.className = 'search-by-div';
                searchbydiv.innerHTML = search_html;
                $('#rfp-search').append( searchbydiv );

            },
            searchtoggle: function() {

                window.rfp.reset_search();
                $('#rfp-search').animate( { 'width': 'toggle' }, 170 );
                window.rfp.reset_queue_hilight();
            },

            uketoggle: function() {

              $('#rfp-ukulele').empty();
              $('#rfp-ukulele').animate( { 'width': 'toggle' }, 170 );


              // Add back the close button..
              var uketoggle = $('A#uke-toggle' ).clone( true );
              console.log('got uke hide btn ' + uketoggle  );
              uketoggle.className = 'rfp-in-uke-toggle';
              $(uketoggle).css( 'position', 'relative' );
              $(uketoggle).css( 'left', '0' );
              $(uketoggle).css( 'top', 0 );

              $(uketoggle).empty();
              $(uketoggle).attr( 'title', 'Close the search box' );

              var qtimg = document.createElement( 'img' );
              qtimg.src = drupalSettings.rfplisten.images.ukehide;

              $(qtimg).css( 'width', '35px').css( 'height', '35px' );
              $(uketoggle).append( qtimg );

              var uke = document.createElement( 'div' );
              uke.innerHTML = '<br/><h2>Free Ukulele Chord Books</h2>';
              uke.innerHTML += "<p>You always wanted to learn how to play the Ukulele, but never had a chord book. "
              + "Well now you do. More than just a chord book: you have a complete chord dictionary for"
              + " left and right handed soprano and baritone ukulele!  That's right - EVERY POSSIBLE UKULELE CHORD to the 14th fret.</p><p>"
              + "These chord books are offered free of charge provided any use of the material within is "
              + "credited to its original author, Dr. Stephen Luke.  Many thanks to Dr Luke for sharing his skills "
              + "freely with the ukulele-playing world.</p>"
              + "<p>Enjoy!</p>";

              // Add the pdf links
              uke.innerHTML += '<br/><br/><div class="uke-chord-books">'
                +'<a href="/sites/radiofreepeterborough.ca/files/pdf/LH Uke Complete.pdf" >Soprano Uke - Left Handed</a><br/>'
                +'<a href="/sites/radiofreepeterborough.ca/files/pdf/RH Uke Complete.pdf" >Soprano Uke - Right Handed</a>'
                +'<br/><br/>'
                +'<a href="/sites/radiofreepeterborough.ca/files/pdf/LH Bari Uke Complete.pdf" >Baritone Uke - Left Handed</a><br/>'
                +'<a href="/sites/radiofreepeterborough.ca/files/pdf/RH Bari Uke Complete.pdf" >Baritone Uke - Right Handed</a>'
                + '</div>';


              $('#rfp-ukulele').append( uketoggle );
              $('#rfp-ukulele').append( uke );

            },

            infotoggle: function () {

			  $('#rfp-info').empty();
              $('#rfp-info').animate( { 'width': 'toggle' }, 170 );


              // Add back the close button..
              var infotoggle = $('A#info-toggle' ).clone( true );

              infotoggle.className = 'rfp-in-info-toggle';
              $(infotoggle).css( 'position', 'relative' );
              $(infotoggle).css( 'left', '0' );
              $(infotoggle).css( 'top', 0 );

              $(infotoggle).empty();
              $(infotoggle).attr( 'title', 'Close the info box' );

              var qtimg = document.createElement( 'img' );
              qtimg.src = drupalSettings.rfplisten.images.infohide;

              $(qtimg).css( 'width', '35px').css( 'height', '35px' );
              $(infotoggle).append( qtimg );

              var info = document.createElement( 'div' );


			  info.innerHTML = '<br/><h3>About Radio Free Peterborough</h3>';
			  info.innerHTML +=  '<p>RFP exists to promote and preserve the unique'
				+ ' musical heritage of Peterborough Ontario for audiences local and global, present and future.</p><p> '
				+ 'Listen with this website, our free mobile <a href="/apps" target="_blank" title="Download free Radio Free Peterborough and Trent Radio Apps">apps</a> '
				+ 'or all night every night on Trent Radio 92.7 FM CFFF in Peterborough and surrounding area.</p><p>If you have any questions or '
			    + 'comments, please don\'t hesitate to <a id="contact_us">contact us</a>.</p><hr/><p>RFP is a volunteer-run project. '
          +' If you like that sort of thing, you can support our work with '
			    + 'a tax-deductible donation through Trent Radio <a href="https://www.canadahelps.org/dn/14907" target="_blank">by clicking here</a>.'
			    + '</p><p>Please select "Radio Free Peterborough Streaming Fund" on the donation page to earmark your '
			    + 'donation for RFP.  Donations of $50 or more will receive a tax receipt from Trent Radio.</p>';


			  $('#rfp-info').append( infotoggle );
			  $('#rfp-info').append( info );

			  $('#contact_us').click( function() {

					var email = String('steve') + String('@') + String('radiofreepeterborough.ca');
					var subject = 'Radio Free Peterborough Feedback';
					var body_message = 'I have something to say about Radio Free Peterborough:' + "\n\n";

					var mailto_link = 'mailto:' + email + '?subject='
					  + subject + '&body=' + body_message;

					  win = window.open(mailto_link, 'emailWindow');
					  //if (win && win.open && !win.closed) win.close();
			  });
            },

            rfp_search: function() {

                document.body.style.cursor = 'wait';


        				// Remove any old search results..
        				$('.rfp-search-results').remove();

                var mode = $('#rfp-search-for').val();
                var keywords_raw = $('#rfp-search-keywords').val();
                var url = drupalSettings.rfplisten.searchprovider  + mode + '/1/' + keywords_raw;

                if( keywords_raw == '' ) {
                  document.body.style.cursor = 'default';
                  alert('Please enter some keywords');
                  $('#rfp-search-keywords').css( 'border', 'solid thin red' );
                  return;
                }

                $.get( url, function( data ) {

        					var results_display = document.createElement( 'ul' );
        					results_display.className = 'rfp-search-results';



        					var results =  JSON.parse( data );
        					if( results.length == 0 ) {
        						  alert( "Sorry - your search produced no results");
        						  return null;
        					}

        					for( var x = 0; x <= results.length - 1; ++x ) {

        							var result_row = document.createElement( 'li' );
        							result_row.className = 'rfp-search-result';
        							result_row.setAttribute( 'id', 'search_' + mode + '_id_' + results[x].nid );

        							$(result_row).on( 'click', function( e ) {

        								  var id = $(this).attr('id');
        								  var id_chunks = id.split( '_' );
        								  var mode = id_chunks[1];
        								  var id = id_chunks[3];
        								  var url = '/?mode=' + mode + '&id=' + id;
        								  document.location = url;
        							});

        							var html = '';
                      var id = "search_" + mode + "_id_" + results[x].nid;

        							switch( mode ) {

        							  case 'artist':
        								  html = "<h2 id='" + id + "'>" + results[x].title + '</h2>';
        								  break;

        							  case 'recording':
        								  html = '<img id="' + id + '" src="' + results[x].cover + '" class="rfp-search-result-thumb" />';
        								  html += '<h2 id="' + id + '" class="rfp-search-result-title">' + results[x].title + '</h2>';
        								  html += '<h2 id="' + id + '" class="rfp-search-result-subtitle">' + results[x].artist_name + '</h2>';
        								  break;

        							  case 'track':
                          html = '<img id="' + id + '" src="' + results[x].recording_cover + '" class="rfp-search-result-thumb" />';
                          html += '<h2 id="' + id + '" class="rfp-search-result-title">' + results[x].title + '</h2>';
                          html += '<h2 id="' + id + '" class="rfp-search-result-subtitle">' + results[x].recording_title + ' - ' + results[x].artist_name + '</h2>';
                          break;
        							}

        							result_row.innerHTML = html;
        							$(results_display).append( result_row );
        					}

        					$('#rfp-search').append( results_display );
                  document.body.style.cursor = 'default';
                });
            },


            reset_queue_hilight: function() {

                var track_counter   = 0;

                var q = $( '#rfp-queue');

                $('.rfp-queue-track').each( function( index, thistrack ) {

                    $(thistrack).removeClass( 'queue-current-track' );

                    if( track_counter == window.rfp.queue_index ) {

                        $(thistrack).addClass( 'queue-current-track' );

                        $(q).animate( {
                            scrollTop: ($(thistrack).height() * window.rfp.queue_index) - 200
                        }, 300 );
                    }

                    ++track_counter;
                });
            },

            // Skip ahead / behind in the queue by array index (zero based)
            queue_skip_to: function( to ) {

                // Force bounds
                if( to < 0 ) { to = 0; }
                if( to > this.queue.length - 1 ) { to = 0; }

                var was_playing = this.playing;

				        this.playing = 0;
                this.queue_index = to;
                this.reset_queue_hilight();
                this.play_queue();
                this.reset_button_bar();

                if( was_playing == 1 ) {

                    this.playtoggle();
                }
            },

		  showCurrentTrack: function() {

  			$('#unsupported').hide();

  			var target = document.getElementById('rfp-wrapper')
  			document.spinner = new Spinner(document.spinner_opts).spin(target);

  			$('#rfp-track-details').hide();
  			$('#rfp-track-title').text( this.currentTrack.title );
  			document.title = this.currentTrack.title + ' - ' + this.currentTrack.artist_name + ' | Radio Free Peterborough ';

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

  			}, false );

  			cover.src =  this.currentTrack.recording_cover;
  			$(cover).css( 'display', 'none' );
  			$('#rfp-recording-cover').append( cover );
  			$('#like-button-holder').empty();

  			 // Share / Like Button..
  			if( this.queue.length > 0 ) {


  				var current_trackid = this.queue[ this.queue_index ].nid;
  				var fb_like = '<div class="fb-like" data-href="http://'  + window.location.hostname
  				  + '/?mode=track&amp;id=' + current_trackid
  				  + '" data-layout="button" data-width="150" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div>';

  				var fb_like = '<iframe src="https://www.facebook.com/plugins/like.php?href=http://'  + window.location.hostname
  				  + '/?mode=track%26id=' + current_trackid +'&width=450&layout=standard&action=like&show_faces=true&share=true&height=80&appId" width="450" height="80" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';

  				var like_wrapper = document.createElement( 'div' );
  				like_wrapper.className = 'like-wrapper';
  				like_wrapper.innerHTML = fb_like;

          if( $(window).width() > 519 ) {
  				      $('#like-button-holder').append( like_wrapper );
          }

          if( this.mode == 'random' || this.mode == 'track' ) {

                var recording_id = this.queue[ this.queue_index ].recording;


                var recording_link      = document.createElement( 'a' );
                var recording_link_icon = document.createElement( 'img' );
                recording_link_icon.src = drupalSettings.rfplisten.images.recordinglisten;
                $(recording_link).append( recording_link_icon );
                $(recording_link).attr( 'href', '/?mode=recording&id=' + recording_id );
                recording_link.className = 'rfp-recording-listen-icon';
                $(recording_link).attr( 'title', 'Listen to this entire recording: '
                  +  this.queue[ this.queue_index ].recording_title
                  + ' by ' + this.queue[ this.queue_index ].artist_name );

                $('#like-button-holder').append( recording_link );

          }
  		}
      },

      _fetch_track: function( id ) {  // Load our track info..

          this.currentTrackId = id;

          var data_path = drupalSettings.rfplisten.datasource_tracks + id.toString() + '.json';

          $.getJSON(data_path, function( json ) {
                  window.rfp._init_track( json );
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

          if(!$('#rfp-prev').hasClass( 'disabled' )) {
                this.queue_skip_to( this.queue_index - 1 );
          }
      },
      next_track: function() {

           if(!$('#rfp-next').hasClass( 'disabled' )) {
               this.queue_skip_to(Number(this.queue_index) + 1);
          }
      },

      reset_button_bar: function() {

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

	  get_url_param: function( p ) {
		  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		  sURLVariables = sPageURL.split('&'),
		  sParameterName,
		  i;
		  for (i = 0; i < sURLVariables.length; i++) {
  			sParameterName = sURLVariables[i].split('=');

  			if (sParameterName[0] === p) {
  			  return sParameterName[1] === undefined ? true : sParameterName[1];
  			}
  		 }
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
