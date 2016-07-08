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
      
    return $build;  
  } 
}

?>