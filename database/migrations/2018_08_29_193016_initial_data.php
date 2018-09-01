<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialData extends Migration
{
    const ROLE_SCOPES = [
         'marketplace',
         'store',
    ];

    // $role_scope_id => $name
    const ROLES = [
        1 => 'admin',
        2 => 'admin',
    ];

    // Grabbed from https://gist.github.com/djaiss/2938259
    const COUNTRIES = [
        "US" => "United States",
        "AF" => "Afghanistan",
        "AL" => "Albania",
        "DZ" => "Algeria",
        "AS" => "American Samoa",
        "AD" => "Andorra",
        "AO" => "Angola",
        "AI" => "Anguilla",
        "AQ" => "Antarctica",
        "AG" => "Antigua and Barbuda",
        "AR" => "Argentina",
        "AM" => "Armenia",
        "AW" => "Aruba",
        "AU" => "Australia",
        "AT" => "Austria",
        "AZ" => "Azerbaijan",
        "BS" => "Bahamas",
        "BH" => "Bahrain",
        "BD" => "Bangladesh",
        "BB" => "Barbados",
        "BY" => "Belarus",
        "BE" => "Belgium",
        "BZ" => "Belize",
        "BJ" => "Benin",
        "BM" => "Bermuda",
        "BT" => "Bhutan",
        "BO" => "Bolivia",
        "BA" => "Bosnia and Herzegovina",
        "BW" => "Botswana",
        "BV" => "Bouvet Island",
        "BR" => "Brazil",
        "IO" => "British Indian Ocean Territory",
        "BN" => "Brunei Darussalam",
        "BG" => "Bulgaria",
        "BF" => "Burkina Faso",
        "BI" => "Burundi",
        "KH" => "Cambodia",
        "CM" => "Cameroon",
        "CA" => "Canada",
        "CV" => "Cape Verde",
        "KY" => "Cayman Islands",
        "CF" => "Central African Republic",
        "TD" => "Chad",
        "CL" => "Chile",
        "CN" => "China",
        "CX" => "Christmas Island",
        "CC" => "Cocos (Keeling) Islands",
        "CO" => "Colombia",
        "KM" => "Comoros",
        "CG" => "Congo",
        "CD" => "Congo, the Democratic Republic of the",
        "CK" => "Cook Islands",
        "CR" => "Costa Rica",
        "CI" => "Cote D'Ivoire",
        "HR" => "Croatia",
        "CU" => "Cuba",
        "CY" => "Cyprus",
        "CZ" => "Czech Republic",
        "DK" => "Denmark",
        "DJ" => "Djibouti",
        "DM" => "Dominica",
        "DO" => "Dominican Republic",
        "EC" => "Ecuador",
        "EG" => "Egypt",
        "SV" => "El Salvador",
        "GQ" => "Equatorial Guinea",
        "ER" => "Eritrea",
        "EE" => "Estonia",
        "ET" => "Ethiopia",
        "FK" => "Falkland Islands (Malvinas)",
        "FO" => "Faroe Islands",
        "FJ" => "Fiji",
        "FI" => "Finland",
        "FR" => "France",
        "GF" => "French Guiana",
        "PF" => "French Polynesia",
        "TF" => "French Southern Territories",
        "GA" => "Gabon",
        "GM" => "Gambia",
        "GE" => "Georgia",
        "DE" => "Germany",
        "GH" => "Ghana",
        "GI" => "Gibraltar",
        "GR" => "Greece",
        "GL" => "Greenland",
        "GD" => "Grenada",
        "GP" => "Guadeloupe",
        "GU" => "Guam",
        "GT" => "Guatemala",
        "GN" => "Guinea",
        "GW" => "Guinea-Bissau",
        "GY" => "Guyana",
        "HT" => "Haiti",
        "HM" => "Heard Island and Mcdonald Islands",
        "VA" => "Holy See (Vatican City State)",
        "HN" => "Honduras",
        "HK" => "Hong Kong",
        "HU" => "Hungary",
        "IS" => "Iceland",
        "IN" => "India",
        "ID" => "Indonesia",
        "IR" => "Iran, Islamic Republic of",
        "IQ" => "Iraq",
        "IE" => "Ireland",
        "IL" => "Israel",
        "IT" => "Italy",
        "JM" => "Jamaica",
        "JP" => "Japan",
        "JO" => "Jordan",
        "KZ" => "Kazakhstan",
        "KE" => "Kenya",
        "KI" => "Kiribati",
        "KP" => "Korea, Democratic People's Republic of",
        "KR" => "Korea, Republic of",
        "KW" => "Kuwait",
        "KG" => "Kyrgyzstan",
        "LA" => "Lao People's Democratic Republic",
        "LV" => "Latvia",
        "LB" => "Lebanon",
        "LS" => "Lesotho",
        "LR" => "Liberia",
        "LY" => "Libyan Arab Jamahiriya",
        "LI" => "Liechtenstein",
        "LT" => "Lithuania",
        "LU" => "Luxembourg",
        "MO" => "Macao",
        "MK" => "Macedonia, the Former Yugoslav Republic of",
        "MG" => "Madagascar",
        "MW" => "Malawi",
        "MY" => "Malaysia",
        "MV" => "Maldives",
        "ML" => "Mali",
        "MT" => "Malta",
        "MH" => "Marshall Islands",
        "MQ" => "Martinique",
        "MR" => "Mauritania",
        "MU" => "Mauritius",
        "YT" => "Mayotte",
        "MX" => "Mexico",
        "FM" => "Micronesia, Federated States of",
        "MD" => "Moldova, Republic of",
        "MC" => "Monaco",
        "MN" => "Mongolia",
        "MS" => "Montserrat",
        "MA" => "Morocco",
        "MZ" => "Mozambique",
        "MM" => "Myanmar",
        "NA" => "Namibia",
        "NR" => "Nauru",
        "NP" => "Nepal",
        "NL" => "Netherlands",
        "AN" => "Netherlands Antilles",
        "NC" => "New Caledonia",
        "NZ" => "New Zealand",
        "NI" => "Nicaragua",
        "NE" => "Niger",
        "NG" => "Nigeria",
        "NU" => "Niue",
        "NF" => "Norfolk Island",
        "MP" => "Northern Mariana Islands",
        "NO" => "Norway",
        "OM" => "Oman",
        "PK" => "Pakistan",
        "PW" => "Palau",
        "PS" => "Palestinian Territory, Occupied",
        "PA" => "Panama",
        "PG" => "Papua New Guinea",
        "PY" => "Paraguay",
        "PE" => "Peru",
        "PH" => "Philippines",
        "PN" => "Pitcairn",
        "PL" => "Poland",
        "PT" => "Portugal",
        "PR" => "Puerto Rico",
        "QA" => "Qatar",
        "RE" => "Reunion",
        "RO" => "Romania",
        "RU" => "Russian Federation",
        "RW" => "Rwanda",
        "SH" => "Saint Helena",
        "KN" => "Saint Kitts and Nevis",
        "LC" => "Saint Lucia",
        "PM" => "Saint Pierre and Miquelon",
        "VC" => "Saint Vincent and the Grenadines",
        "WS" => "Samoa",
        "SM" => "San Marino",
        "ST" => "Sao Tome and Principe",
        "SA" => "Saudi Arabia",
        "SN" => "Senegal",
        "CS" => "Serbia and Montenegro",
        "SC" => "Seychelles",
        "SL" => "Sierra Leone",
        "SG" => "Singapore",
        "SK" => "Slovakia",
        "SI" => "Slovenia",
        "SB" => "Solomon Islands",
        "SO" => "Somalia",
        "ZA" => "South Africa",
        "GS" => "South Georgia and the South Sandwich Islands",
        "ES" => "Spain",
        "LK" => "Sri Lanka",
        "SD" => "Sudan",
        "SR" => "Suriname",
        "SJ" => "Svalbard and Jan Mayen",
        "SZ" => "Swaziland",
        "SE" => "Sweden",
        "CH" => "Switzerland",
        "SY" => "Syrian Arab Republic",
        "TW" => "Taiwan, Province of China",
        "TJ" => "Tajikistan",
        "TZ" => "Tanzania, United Republic of",
        "TH" => "Thailand",
        "TL" => "Timor-Leste",
        "TG" => "Togo",
        "TK" => "Tokelau",
        "TO" => "Tonga",
        "TT" => "Trinidad and Tobago",
        "TN" => "Tunisia",
        "TR" => "Turkey",
        "TM" => "Turkmenistan",
        "TC" => "Turks and Caicos Islands",
        "TV" => "Tuvalu",
        "UG" => "Uganda",
        "UA" => "Ukraine",
        "AE" => "United Arab Emirates",
        "GB" => "United Kingdom",
        "UM" => "United States Minor Outlying Islands",
        "UY" => "Uruguay",
        "UZ" => "Uzbekistan",
        "VU" => "Vanuatu",
        "VE" => "Venezuela",
        "VN" => "Viet Nam",
        "VG" => "Virgin Islands, British",
        "VI" => "Virgin Islands, U.s.",
        "WF" => "Wallis and Futuna",
        "EH" => "Western Sahara",
        "YE" => "Yemen",
        "ZM" => "Zambia",
        "ZW" => "Zimbabwe"
    ];

    // Grabbed from https://github.com/umpirsky/currency-list/blob/master/data/en/currency.php
    // Edited for expired and Euro-consolidated currencies.
    const CURRENCIES = [
        'USD' => 'US Dollar',
        'AFN' => 'Afghan Afghani',
        'ALL' => 'Albanian Lek',
        'DZD' => 'Algerian Dinar',
        'ADP' => 'Andorran Peseta',
        'AOA' => 'Angolan Kwanza',
        'ARS' => 'Argentine Peso',
        'AMD' => 'Armenian Dram',
        'AWG' => 'Aruban Florin',
        'AUD' => 'Australian Dollar',
        'AZN' => 'Azerbaijani Manat',
        'BSD' => 'Bahamian Dollar',
        'BHD' => 'Bahraini Dinar',
        'BDT' => 'Bangladeshi Taka',
        'BBD' => 'Barbadian Dollar',
        'BYN' => 'Belarusian Ruble',
        'BZD' => 'Belize Dollar',
        'BMD' => 'Bermudan Dollar',
        'BTN' => 'Bhutanese Ngultrum',
        'BOB' => 'Bolivian Boliviano',
        'BAM' => 'Bosnia-Herzegovina Convertible Mark',
        'BWP' => 'Botswanan Pula',
        'BRL' => 'Brazilian Real',
        'GBP' => 'British Pound',
        'BND' => 'Brunei Dollar',
        'BGN' => 'Bulgarian Lev',
        'BUK' => 'Burmese Kyat',
        'BIF' => 'Burundian Franc',
        'XPF' => 'CFP Franc',
        'KHR' => 'Cambodian Riel',
        'CAD' => 'Canadian Dollar',
        'CVE' => 'Cape Verdean Escudo',
        'KYD' => 'Cayman Islands Dollar',
        'XAF' => 'Central African CFA Franc',
        'CLP' => 'Chilean Peso',
        'CNY' => 'Chinese Yuan',
        'COP' => 'Colombian Peso',
        'KMF' => 'Comorian Franc',
        'CDF' => 'Congolese Franc',
        'CRC' => 'Costa Rican Colón',
        'HRK' => 'Croatian Kuna',
        'CUP' => 'Cuban Peso',
        'CZK' => 'Czech Koruna',
        'DKK' => 'Danish Krone',
        'DJF' => 'Djiboutian Franc',
        'DOP' => 'Dominican Peso',
        'XCD' => 'East Caribbean Dollar',
        'DDM' => 'East German Mark',
        'ECS' => 'Ecuadorian Sucre',
        'EGP' => 'Egyptian Pound',
        'GQE' => 'Equatorial Guinean Ekwele',
        'ERN' => 'Eritrean Nakfa',
        'ETB' => 'Ethiopian Birr',
        'EUR' => 'Euro',
        'FKP' => 'Falkland Islands Pound',
        'FJD' => 'Fijian Dollar',
        'GMD' => 'Gambian Dalasi',
        'GEK' => 'Georgian Kupon Larit',
        'GEL' => 'Georgian Lari',
        'GHS' => 'Ghanaian Cedi',
        'GIP' => 'Gibraltar Pound',
        'GTQ' => 'Guatemalan Quetzal',
        'GWP' => 'Guinea-Bissau Peso',
        'GNF' => 'Guinean Franc',
        'GYD' => 'Guyanaese Dollar',
        'HTG' => 'Haitian Gourde',
        'HNL' => 'Honduran Lempira',
        'HKD' => 'Hong Kong Dollar',
        'HUF' => 'Hungarian Forint',
        'ISK' => 'Icelandic Króna',
        'INR' => 'Indian Rupee',
        'IDR' => 'Indonesian Rupiah',
        'IRR' => 'Iranian Rial',
        'IQD' => 'Iraqi Dinar',
        'ILS' => 'Israeli New Shekel',
        'JMD' => 'Jamaican Dollar',
        'JPY' => 'Japanese Yen',
        'JOD' => 'Jordanian Dinar',
        'KZT' => 'Kazakhstani Tenge',
        'KES' => 'Kenyan Shilling',
        'KWD' => 'Kuwaiti Dinar',
        'KGS' => 'Kyrgystani Som',
        'LAK' => 'Laotian Kip',
        'LBP' => 'Lebanese Pound',
        'LSL' => 'Lesotho Loti',
        'LRD' => 'Liberian Dollar',
        'LYD' => 'Libyan Dinar',
        'MOP' => 'Macanese Pataca',
        'MKD' => 'Macedonian Denar',
        'MGA' => 'Malagasy Ariary',
        'MWK' => 'Malawian Kwacha',
        'MYR' => 'Malaysian Ringgit',
        'MVR' => 'Maldivian Rufiyaa',
        'MLF' => 'Malian Franc',
        'MRO' => 'Mauritanian Ouguiya',
        'MUR' => 'Mauritian Rupee',
        'MXN' => 'Mexican Peso',
        'MDL' => 'Moldovan Leu',
        'MCF' => 'Monegasque Franc',
        'MNT' => 'Mongolian Tugrik',
        'MAD' => 'Moroccan Dirham',
        'MZN' => 'Mozambican Metical',
        'MMK' => 'Myanmar Kyat',
        'NAD' => 'Namibian Dollar',
        'NPR' => 'Nepalese Rupee',
        'ANG' => 'Netherlands Antillean Guilder',
        'TWD' => 'New Taiwan Dollar',
        'NZD' => 'New Zealand Dollar',
        'NIO' => 'Nicaraguan Córdoba',
        'NGN' => 'Nigerian Naira',
        'KPW' => 'North Korean Won',
        'NOK' => 'Norwegian Krone',
        'OMR' => 'Omani Rial',
        'PKR' => 'Pakistani Rupee',
        'PAB' => 'Panamanian Balboa',
        'PGK' => 'Papua New Guinean Kina',
        'PYG' => 'Paraguayan Guarani',
        'PEN' => 'Peruvian Sol',
        'PHP' => 'Philippine Peso',
        'PLN' => 'Polish Zloty',
        'QAR' => 'Qatari Rial',
        'XRE' => 'RINET Funds',
        'RHD' => 'Rhodesian Dollar',
        'RON' => 'Romanian Leu',
        'RUB' => 'Russian Ruble',
        'RWF' => 'Rwandan Franc',
        'SVC' => 'Salvadoran Colón',
        'WST' => 'Samoan Tala',
        'SAR' => 'Saudi Riyal',
        'RSD' => 'Serbian Dinar',
        'SCR' => 'Seychellois Rupee',
        'SLL' => 'Sierra Leonean Leone',
        'SGD' => 'Singapore Dollar',
        'SBD' => 'Solomon Islands Dollar',
        'SOS' => 'Somali Shilling',
        'ZAR' => 'South African Rand',
        'KRW' => 'South Korean Won',
        'SSP' => 'South Sudanese Pound',
        'LKR' => 'Sri Lankan Rupee',
        'SHP' => 'St. Helena Pound',
        'SDG' => 'Sudanese Pound',
        'SRD' => 'Surinamese Dollar',
        'SZL' => 'Swazi Lilangeni',
        'SEK' => 'Swedish Krona',
        'CHF' => 'Swiss Franc',
        'SYP' => 'Syrian Pound',
        'STD' => 'São Tomé & Príncipe Dobra',
        'TJS' => 'Tajikistani Somoni',
        'TZS' => 'Tanzanian Shilling',
        'THB' => 'Thai Baht',
        'TPE' => 'Timorese Escudo',
        'TOP' => 'Tongan Paʻanga',
        'TTD' => 'Trinidad & Tobago Dollar',
        'TND' => 'Tunisian Dinar',
        'TRY' => 'Turkish Lira',
        'TMT' => 'Turkmenistani Manat',
        'UGX' => 'Ugandan Shilling',
        'UAH' => 'Ukrainian Hryvnia',
        'AED' => 'United Arab Emirates Dirham',
        'UYU' => 'Uruguayan Peso',
        'UZS' => 'Uzbekistani Som',
        'VUV' => 'Vanuatu Vatu',
        'VEF' => 'Venezuelan Bolívar',
        'VND' => 'Vietnamese Dong',
        'XOF' => 'West African CFA Franc',
        'YER' => 'Yemeni Rial',
        'ZMW' => 'Zambian Kwacha',
        'ZWL' => 'Zimbabwean Dollar',
    ];

    const UNIT_TYPES = [
        'dimension',
        'weight'
    ];

    const UNITS = [
        [
            'name' => 'inches',
            'abbreviation' => 'in',
            'unit_type_id' => 1
        ],
        [
            'name' => 'feet',
            'abbreviation' => 'ft',
            'unit_type_id' => 1
        ],
        [
            'name' => 'millimeters',
            'abbreviation' => 'mm',
            'unit_type_id' => 1
        ],
        [
            'name' => 'centimeters',
            'abbreviation' => 'cm',
            'unit_type_id' => 1
        ],
        [
            'name' => 'meters',
            'abbreviation' => 'm',
            'unit_type_id' => 1
        ],
        [
            'name' => 'pounds',
            'abbreviation' => 'lb',
            'unit_type_id' => 2
        ],
        [
            'name' => 'kilograms',
            'abbreviation' => 'kg',
            'unit_type_id' => 2
        ],
    ];

    /**
     * Run the migrations.
     *
     * All these migrations are considered structural data critical to the
     * architecture of the application, and they need to be applied in
     * production as well as dev, hence their status as migrations rather than
     * seeds. These are done as raw DB operations so they're unaffected by
     * subsequent changes to the models.
     *
     * @return void
     */
    public function up()
    {
        // Account for multiple cycles of migration reversals with soft-deletes.
        foreach (self::ROLE_SCOPES as $scope) {
            if (DB::table('role_scopes')->where('name', $scope)->count() > 0) {
                DB::table('role_scopes')
                    ->where('name', $scope)
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('role_scopes')->insert([ 'name' => $scope ]);
            }
        }

        foreach (self::ROLES as $scope_id => $role) {
            if (DB::table('roles')
                ->where('name', $role)
                ->where('role_scope_id', $scope_id)
                ->count() > 0
            ) {
                DB::table('roles')
                    ->where('name', $role)
                    ->where('role_scope_id', $scope_id)
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('roles')->insert([
                    'name' => $role,
                    'role_scope_id' => $scope_id
                ]);
            }
        }

        foreach (self::COUNTRIES as $abbreviation => $name) {
            if (DB::table('countries')->where('abbreviation', $abbreviation)->count() > 0) {
                DB::table('countries')
                    ->where('abbreviation', $abbreviation)
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('countries')->insert([
                    'name' => $name,
                    'abbreviation' => $abbreviation
                ]);
            }
        }

        foreach (self::CURRENCIES as $abbreviation => $name) {
            if (DB::table('currencies')->where('abbreviation', $abbreviation)->count() > 0) {
                DB::table('currencies')
                    ->where('abbreviation', $abbreviation)
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('currencies')->insert([
                    'name' => $name,
                    'abbreviation' => $abbreviation
                ]);
            }
        }

        foreach (self::UNIT_TYPES as $type) {
            if (DB::table('unit_types')->where('name', $type)->count() > 0) {
                DB::table('unit_types')
                    ->where('name', $type)
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('unit_types')->insert([ 'name' => $type ]);
            }
        }

        foreach (self::UNITS as $unit) {
            if (DB::table('units')->where('name', $unit['name'])->count() > 0) {
                DB::table('units')
                    ->where('name', $unit['name'])
                    ->update([ 'deleted_at' => null ]);
            } else {
                DB::table('units')->insert($unit);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('role_scopes')
            ->whereIn('name', self::ROLE_SCOPES)
            ->update([ 'deleted_at' => 'NOW()' ]);

        foreach (self::ROLES as $scope_id => $role) {
            DB::table('roles')
                ->where('name', $role)
                ->where('role_scope_id', $scope_id)
                ->update([ 'deleted_at' => 'NOW()' ]);
        }

        DB::table('countries')
            ->whereIn('abbreviation', array_keys(self::COUNTRIES))
            ->update([ 'deleted_at' => 'NOW()' ]);

        DB::table('currencies')
            ->whereIn('abbreviation', array_keys(self::CURRENCIES))
            ->update([ 'deleted_at' => 'NOW()' ]);

        DB::table('unit_types')
            ->whereIn('name', self::UNIT_TYPES)
            ->update([ 'deleted_at' => 'NOW()' ]);

        DB::table('units')
            ->whereIn('name', array_pluck(self::UNITS, 'name'))
            ->update([ 'deleted_at' => 'NOW()' ]);
    }
}
