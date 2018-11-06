<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\RoleScope;
use App\Models\User;
use Faker\Factory;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use PHPUnit_Extensions_Selenium2TestCase_Keys as Keys;

class UserWebTest extends \PHPUnit_Extensions_Selenium2TestCase
{
    use DatabaseMigrations;

    protected $name = 'test user';

    protected $email = 'test123@example.com';

    protected $password = 'secret';

    protected function setUp()
    {
        $this->setBrowser(env('SELENIUM_BROWSER'));
        $this->setHost(env('SELENIUM_HOST'));
        $this->setBrowserUrl(env('APP_URL') . '/');
    }

    public function testUnregisteredLogin()
    {
        $this->timeouts()->implicitWait(10000);
        $this->url('/login');

        $this->byId('formControlsUsername')->value($this->email);
        $this->byId('formControlsPassword')->value($this->password);
        $this->byId('form-login')->submit();

        // Make the test await the spinner and then the login form again.
        $this->byClassName('loading-spinner');
        $this->byId('form-login');

        // Login should have failed for this unregistered user, redirecting back
        // to /login.
        $this->assertStringEndsWith('/login', $this->url());
    }

    public function testRegistrationLogin()
    {
        $this->timeouts()->implicitWait(10000);
        $this->url('/register');

        $this->byId('formBasicFullName')->value($this->name);
        $this->byId('formBasicUsername')->value($this->email);
        $this->byId('formBasicPassword')->value($this->password);
        $this->byId('formBasicConfirmPassword')->value($this->password);
        $this->byId('form-register')->submit();

        // Make the test await the spinner and then the login form before assert.
        $this->byClassName('loading-spinner');
        $login_form = $this->byId('form-login');

        $this->assertStringEndsWith('/login', $this->url());

        $this->byId('formControlsUsername')->value($this->email);
        $this->byId('formControlsPassword')->value($this->password);
        $login_form->submit();

        // Make the test await the spinner and then landing page content before
        // asserting location.
        $this->byClassName('loading-spinner');
        $this->byTag('table');

        $this->assertEquals(env('APP_URL') . '/', $this->url());
    }

    public function testUserProfile()
    {
        $this->timeouts()->implicitWait(10000);
        $this->url('/login');

        $this->byId('formControlsUsername')->value($this->email);
        $this->byId('formControlsPassword')->value($this->password);
        $this->byId('form-login')->submit();

        // Make the test await the spinner and then the landing page with table.
        $this->byClassName('loading-spinner');
        $this->byTag('table');

        $this->url('/account');

        // Await the spinner and then the account page.
        $this->byClassName('loading-spinner');
        $this->byTag('h3');

        $this->assertEquals($this->name, $this->byClassName('user-name')->text());
        $this->assertEquals($this->email, $this->byClassName('user-email')->text());
    }
}
