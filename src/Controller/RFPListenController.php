<?php

namespace Drupal\rfp_listen\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;

class RFPListenController extends ControllerBase {

  public function listen_page() {

    $mode   = $_GET['mode'];
    $id     = $_GET['id'];

    if( !$mode ) $mode = 'random';
    if( !$id   ) $id = 0;

    $build = array(
        '#theme' 	=> 'rfp_listen_main',
        '#test_var' => $this->t('Test Value')
    );

    $data_source = '/sites/radiofreepeterborough.ca/data/';

    $build['#attached']['drupalSettings']['rfplisten']['debug'] = 1;
    $build['#attached']['drupalSettings']['rfplisten']['datasource'] = $data_source;
    $build['#attached']['drupalSettings']['rfplisten']['datasource_artists'] = $data_source . 'artists.json';
    $build['#attached']['drupalSettings']['rfplisten']['datasource_tracks']  = $data_source . '/tracks/';
    $build['#attached']['drupalSettings']['rfplisten']['datasource_random_tracks'] = '/random-tracks/';

    $artist_url = '/sites/' . \Drupal::request()->getHost() .'/data/artists.json';
    $tracks_url = '/sites/' . \Drupal::request()->getHost() .'/data/tracks.json';

    $build['#attached']['drupalSettings']['rfplisten']['artists_datasource'] = $artist_url;
    $build['#attached']['drupalSettings']['rfplisten']['tracks_datasource']  = $tracks_url;

    // Mode and id
    $build['#attached']['drupalSettings']['rfplisten']['mode'] = $mode;
    $build['#attached']['drupalSettings']['rfplisten']['id']   = $id;

	// Player Graphical Resources
	$theme_path = '/' .\Drupal::theme()->getActiveTheme()->getPath() .'/images/';

	$build['#attached']['drupalSettings']['rfplisten']['images']['play']  = $theme_path . 'play.png';
	$build['#attached']['drupalSettings']['rfplisten']['images']['pause'] = $theme_path . 'pause.png';
	$build['#attached']['drupalSettings']['rfplisten']['images']['next']  = $theme_path . 'next.png';
	$build['#attached']['drupalSettings']['rfplisten']['images']['prev']  = $theme_path . 'prev.png';
  $build['#attached']['drupalSettings']['rfplisten']['images']['queueshow']   = $theme_path . 'playlist.png';
  $build['#attached']['drupalSettings']['rfplisten']['images']['queuehide']   = $theme_path . 'queuehide.png';













    return $build;
  }
}

?>
