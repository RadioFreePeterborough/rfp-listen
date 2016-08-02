<?php

namespace Drupal\rfp_listen\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;

class RFPListenController extends ControllerBase {

  public function listen_page( $mode, $id ) {

      $build = array(
        '#theme' 	  => 'rfp_listen_main',
      );

      $data_source = '/sites/radiofreepeterborough.ca/data/';

      $build['#attached']['drupalSettings']['rfplisten']['debug'] = 1;
      $build['#attached']['drupalSettings']['rfplisten']['datasource'] = $data_source;
      $build['#attached']['drupalSettings']['rfplisten']['datasource_artist'] = '/artist/';
	  $build['#attached']['drupalSettings']['rfplisten']['datasource_artists'] = $data_source . 'artists.json';
      $build['#attached']['drupalSettings']['rfplisten']['datasource_tracks']  = $data_source . '/tracks/';
      $build['#attached']['drupalSettings']['rfplisten']['datasource_tracks_by_recording']  = $data_source . '/tracks/by/recording/';
      $build['#attached']['drupalSettings']['rfplisten']['datasource_recordings_by_id'] = $data_source . '/recordings/by/id/';
      $build['#attached']['drupalSettings']['rfplisten']['datasource_recordings_by_artist'] = $data_source . '/recordings/by/artist/';
      $build['#attached']['drupalSettings']['rfplisten']['datasource_random_tracks'] = '/random-tracks/';

      $build['#attached']['drupalSettings']['rfplisten']['searchprovider'] = '/rfp/search/';


      // This setting controls how many random tracks to grab per randomized playlist
      $build['#attached']['drupalSettings']['rfplisten']['datasource_random_tracks_count'] = '50';

      $artist_url = '/sites/' . \Drupal::request()->getHost() .'/data/artists.json';
      $tracks_url = '/sites/' . \Drupal::request()->getHost() .'/data/tracks.json';

      $build['#attached']['drupalSettings']['rfplisten']['artists_datasource'] = $artist_url;
      $build['#attached']['drupalSettings']['rfplisten']['tracks_datasource']  = $tracks_url;

      // Mode and id
      //$build['#attached']['drupalSettings']['rfplisten']['mode'] = $mode;
      //$build['#attached']['drupalSettings']['rfplisten']['id']   = $id;

      // Player Graphical Resources
      $theme_path = '/' .\Drupal::theme()->getActiveTheme()->getPath() .'/images/';

      $build['#attached']['drupalSettings']['rfplisten']['images']['play']        = $theme_path . 'play.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['pause']       = $theme_path . 'pause.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['next']        = $theme_path . 'next.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['prev']        = $theme_path . 'prev.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['queueshow']   = $theme_path . 'binder.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['queuehide']   = $theme_path . 'close.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['searchshow']   = $theme_path . 'search.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['searchhide']   = $theme_path . 'close.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['ukeshow']   = $theme_path . 'ukulele.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['ukehide']   = $theme_path . 'close.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['infoshow']   = $theme_path . 'info.png';
      $build['#attached']['drupalSettings']['rfplisten']['images']['infohide']   = $theme_path . 'close.png';

      

      $build['#attached']['drupalSettings']['rfplisten']['images']['recordinglisten']   = $theme_path . 'recording-listen.png';


      return $build;
  }

  public function get_title() {

	  return 'HERE IS THE TITLE AT ' . time();
  }
}

?>
