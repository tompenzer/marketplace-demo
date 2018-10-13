<?php

namespace Tests\Feature;

use PHPUnit_Extensions_Selenium2TestCase_Keys as Keys;

class BaseWebTest extends \PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser(env('SELENIUM_BROWSER'));
        $this->setHost(env('SELENIUM_HOST'));
        $this->setBrowserUrl('http://localhost:8000/');
    }

    public function testTitle()
    {
        $this->url('/');
        $this->assertEquals('Marketplace Demo', $this->title());
    }
}
