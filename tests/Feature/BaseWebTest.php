<?php

namespace Tests\Feature;

use PHPUnit_Extensions_Selenium2TestCase_Keys as Keys;
use Tests\CreatesApplication;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Passport\ClientRepository;

class BaseWebTest extends \PHPUnit_Extensions_Selenium2TestCase
{
    use DatabaseMigrations, CreatesApplication;

    protected function setUp()
    {
        $this->setBrowser(env('SELENIUM_BROWSER'));
        $this->setHost(env('SELENIUM_HOST'));
        $this->setBrowserUrl(env('APP_URL') . '/');

        // Need to call createApplication() in the testing environment in order
        // to install Passport in this environment.
        $this->createApplication();
        \Artisan::call('passport:install');
    }

    public function testTitle()
    {
        $this->url('/');
        $this->assertEquals('Marketplace Demo', $this->title());
    }
}
