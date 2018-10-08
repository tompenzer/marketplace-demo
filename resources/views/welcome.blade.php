<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
    	<meta charset="utf-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1">

    	<!-- CSRF Token -->
    	<meta name="csrf-token" content="{{ csrf_token() }}">

    	<title>{{ config('app.name', 'Laravel') }}</title>

    	<!-- Styles -->
    	<!-- Scripts -->
    	<script>
    		window.Laravel = {!! json_encode([
    			'csrfToken' => csrf_token(),
                'clientId' => env('PASSWORD_CLIENT_ID'),
                'clientSecret' => env('PASSWORD_CLIENT_SECRET'),
    		]) !!};
    	</script>
    </head>
    <body>
        <div id="app"></div>
        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
