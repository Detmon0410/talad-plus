<?php

require_once dirname(__FILE__).'/omise-php-master/lib/Omise.php';
define('OMISE_API_VERSION', '2015-11-17');
// define('OMISE_PUBLIC_KEY', 'PUBLIC_KEY');
// define('OMISE_SECRET_KEY', 'SECRET_KEY');
define('OMISE_PUBLIC_KEY', 'pkey_test_5vblirte7laoz5cncji');
define('OMISE_SECRET_KEY', 'skey_test_5vbliru3x33aquos7yp');

$charge = OmiseCharge::create(array(
  'amount' => 10025,
  'currency' => 'thb',
  'card' => $_POST["omiseToken"]
));

echo($charge['status']);

print('<pre>');
print_r($charge);
print('</pre>');
?>