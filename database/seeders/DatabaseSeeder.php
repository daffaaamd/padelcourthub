<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Court;
use App\Models\Payment;
use App\Models\PricingRule;
use App\Models\Promo;
use App\Models\PromoUsage;
use App\Models\Review;
use App\Models\User;
use App\Models\Venue;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::create([
            'name' => 'Admin PadelCourt',
            'email' => 'admin@padelcourt.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081122334455',
            'email_verified_at' => now(),
        ]);

        $daffa = User::create([
            'name' => 'Daffa Ahmad',
            'email' => 'daffa@padelcourt.id',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '081298765432',
            'email_verified_at' => now(),
        ]);

        $customerNames = [
            ['Kevin Sanjaya', 'kevin@gmail.com', '081211112222'],
            ['Reza Rahadian', 'reza.r@gmail.com', '081222223333'],
            ['Anya Geraldine', 'anya.g@gmail.com', '081233334444'],
            ['Fajar Alfian', 'fajar.a@gmail.com', '081244445555'],
            ['Nicholas Saputra', 'nicholas.s@gmail.com', '081255556666'],
            ['Dian Sastrowardoyo', 'dian.s@gmail.com', '081266667777'],
            ['Greysia Polii', 'greysia.p@gmail.com', '081277778888'],
            ['Gading Marten', 'gading.m@gmail.com', '081288889999'],
            ['Raffi Ahmad', 'raffi.a@gmail.com', '081299990000'],
            ['Taufik Hidayat', 'taufik.h@gmail.com', '081311112222'],
            ['Anthony Ginting', 'anthony.g@gmail.com', '081322223333'],
            ['Jonatan Christie', 'jojo.c@gmail.com', '081333334444'],
            ['Apriyani Rahayu', 'apriyani.r@gmail.com', '081344445555'],
            ['Hamish Daud', 'hamish.d@gmail.com', '081355556666'],
            ['Luna Maya', 'luna.m@gmail.com', '081366667777'],
            ['Rio Dewanto', 'rio.d@gmail.com', '081377778888'],
            ['Pevita Pearce', 'pevita.p@gmail.com', '081388889999'],
            ['Chicco Jerikho', 'chicco.j@gmail.com', '081399990000'],
            ['Isyana Sarasvati', 'isyana.s@gmail.com', '081411112222'],
            ['Daniel Mananta', 'daniel.m@gmail.com', '081422223333'],
        ];

        $customers = [$daffa];
        foreach ($customerNames as [$name, $email, $phone]) {
            $customers[] = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => $phone,
                'email_verified_at' => now(),
            ]);
        }

        // 2. Venues (Including 6 Custom Concept Cards + Premium Arenas)
        $venuesData = [
            [
                'name' => 'Medina Court Padel',
                'description' => 'Venue padel outdoor bernuansa Mediterania & Maroko yang elegan dan estetik. Dikelilingi dinding semen ekspos warna sand beraksen lengkungan (arch), pohon kaktus saguaro, dan zaitun yang teduh di bawah cahaya golden hour sore hari yang lembut.',
                'address' => 'Jl. Pantai Indah Kapuk No. 88, Kawasan Marina PIK 2, Penjaringan',
                'city' => 'Jakarta Utara',
                'province' => 'DKI Jakarta',
                'phone' => '021-5889001',
                'email' => 'medina@padelcourt.id',
                'latitude' => -6.1085,
                'longitude' => 106.7410,
                'opening_time' => '06:00:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Pro Shop'],
                'cover_image' => '/images/venues/padel_medina_court.jpg',
                'images' => [
                    '/images/venues/medina_1.jpg',
                    '/images/venues/medina_2.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Sahara Terracotta', 'type' => 'outdoor', 'price_morning' => 160000, 'price_evening' => 195000, 'price_weekend' => 220000, 'img' => '/images/venues/medina_1.jpg'],
                    ['name' => 'Court 02 — Oasis Pastel Blue', 'type' => 'outdoor', 'price_morning' => 160000, 'price_evening' => 195000, 'price_weekend' => 220000, 'img' => '/images/venues/medina_2.jpg'],
                ],
            ],
            [
                'name' => 'Quantum Padel Arena',
                'description' => 'Arena padel indoor bertema Cyberpunk & Futuristic Glow. Ruangan bertaraf studio gelap yang diterangi dramatis oleh lampu LED neon ungu & cyan mengikuti frame kaca dan lantai biru elektrik untuk pengalaman bermain sekelas turnamen esport.',
                'address' => 'Jl. Puri Indah Raya Blok U1, Kembangan, Puri',
                'city' => 'Jakarta Barat',
                'province' => 'DKI Jakarta',
                'phone' => '021-5830002',
                'email' => 'quantum@padelcourt.id',
                'latitude' => -6.1872,
                'longitude' => 106.7381,
                'opening_time' => '07:00:00',
                'closing_time' => '23:59:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Pro Shop'],
                'cover_image' => '/images/venues/padel_quantum_arena.jpg',
                'images' => [
                    '/images/venues/quantum_1.jpg',
                    '/images/venues/quantum_2.jpg',
                    '/images/venues/quantum_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Cyber Matrix', 'type' => 'indoor', 'price_morning' => 175000, 'price_evening' => 210000, 'price_weekend' => 240000, 'img' => '/images/venues/quantum_1.jpg'],
                    ['name' => 'Court 02 — Neon Pulse', 'type' => 'indoor', 'price_morning' => 175000, 'price_evening' => 210000, 'price_weekend' => 240000, 'img' => '/images/venues/quantum_2.jpg'],
                    ['name' => 'Court 03 — Electric Void', 'type' => 'indoor', 'price_morning' => 165000, 'price_evening' => 200000, 'price_weekend' => 230000, 'img' => '/images/venues/quantum_3.jpg'],
                ],
            ],
            [
                'name' => 'Lagoon View Padel Club',
                'description' => 'Sensasi bermain padel outdoor di atas decking kayu tepi danau dan marina yang tenang. Menawarkan pemandangan air segar dengan siluet yacht dan perbukitan, serta area tunggu waterfront lounge yang asri dan sejuk.',
                'address' => 'Jl. Boulevard Danau Biru No. 5, Kelapa Dua, Gading Serpong',
                'city' => 'Tangerang',
                'province' => 'Banten',
                'phone' => '021-5421003',
                'email' => 'lagoon@padelcourt.id',
                'latitude' => -6.2410,
                'longitude' => 106.6280,
                'opening_time' => '06:00:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket'],
                'cover_image' => '/images/venues/padel_lagoon_view.jpg',
                'images' => [
                    '/images/venues/lagoon_1.jpg',
                    '/images/venues/lagoon_2.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Marina Deck', 'type' => 'outdoor', 'price_morning' => 140000, 'price_evening' => 175000, 'price_weekend' => 195000, 'img' => '/images/venues/lagoon_1.jpg'],
                    ['name' => 'Court 02 — Lake Breeze', 'type' => 'outdoor', 'price_morning' => 140000, 'price_evening' => 175000, 'price_weekend' => 195000, 'img' => '/images/venues/lagoon_2.jpg'],
                ],
            ],
            [
                'name' => 'Batavia Heritage Padel',
                'description' => 'Perpaduan eksklusif antara olahraga padel modern dan kemegahan arsitektur kolonial Belanda klasik. Terletak di dalam courtyard bangunan heritage bata merah terawat dengan lampu gantung klasik dan lobi beranda tanaman pakis.',
                'address' => 'Jl. Teuku Umar No. 28, Menteng, Jakarta Pusat',
                'city' => 'Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'phone' => '021-3901004',
                'email' => 'batavia@padelcourt.id',
                'latitude' => -6.1950,
                'longitude' => 106.8320,
                'opening_time' => '06:30:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Pro Shop'],
                'cover_image' => '/images/venues/padel_batavia_heritage.jpg',
                'images' => [
                    '/images/venues/batavia_1.jpg',
                    '/images/venues/batavia_2.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — De Erfenis Court', 'type' => 'outdoor', 'price_morning' => 165000, 'price_evening' => 195000, 'price_weekend' => 225000, 'img' => '/images/venues/batavia_1.jpg'],
                    ['name' => 'Court 02 — Batavia Royal', 'type' => 'outdoor', 'price_morning' => 165000, 'price_evening' => 195000, 'price_weekend' => 225000, 'img' => '/images/venues/batavia_2.jpg'],
                ],
            ],
            [
                'name' => 'Glasshouse Padel Pavilion',
                'description' => 'Paviliun padel indoor modern berarsitektur glasshouse dengan rangka baja hitam minimalis dan atap kaca penuh cahaya matahari alami. Menghadirkan view taman botani yang asri di luar kaca serta lobi bergaya industrial modern.',
                'address' => 'Jl. Sentul Nirwana Boulevard No. 10, Sentul City, Babakan Madang',
                'city' => 'Bogor',
                'province' => 'Jawa Barat',
                'phone' => '021-8796005',
                'email' => 'glasshouse@padelcourt.id',
                'latitude' => -6.5890,
                'longitude' => 106.8710,
                'opening_time' => '06:00:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket'],
                'cover_image' => '/images/venues/padel_glasshouse_pavilion.jpg',
                'images' => [
                    '/images/venues/glasshouse_1.jpg',
                    '/images/venues/glasshouse_2.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Glass Dome Court', 'type' => 'indoor', 'price_morning' => 135000, 'price_evening' => 165000, 'price_weekend' => 190000, 'img' => '/images/venues/glasshouse_1.jpg'],
                    ['name' => 'Court 02 — Botanical Arena', 'type' => 'indoor', 'price_morning' => 135000, 'price_evening' => 165000, 'price_weekend' => 190000, 'img' => '/images/venues/glasshouse_2.jpg'],
                ],
            ],
            [
                'name' => 'Komorebi Zen Padel Club',
                'description' => 'Venue padel semi-outdoor dengan konsep Japandi & Zen Garden yang menenangkan. Dikelilingi rimbunnya bambu Jepang, taman batu kerikil putih (zen stone garden), kanopi kayu slat wood dengan bayangan sinar sore (komorebi), dan karpet bernuansa moss green yang damai.',
                'address' => 'Jl. Pakar Kulon No. 99, Ciburial, Cimenyan, Dago Pakar',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'phone' => '022-2510006',
                'email' => 'komorebi@padelcourt.id',
                'latitude' => -6.8520,
                'longitude' => 107.6350,
                'opening_time' => '06:00:00',
                'closing_time' => '21:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Musholla'],
                'cover_image' => '/images/venues/padel_komorebi_zen.jpg',
                'images' => [
                    '/images/venues/komorebi_1.jpg',
                    '/images/venues/komorebi_2.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Komorebi Light', 'type' => 'outdoor', 'price_morning' => 130000, 'price_evening' => 160000, 'price_weekend' => 185000, 'img' => '/images/venues/komorebi_1.jpg'],
                    ['name' => 'Court 02 — Zen Garden Court', 'type' => 'outdoor', 'price_morning' => 130000, 'price_evening' => 160000, 'price_weekend' => 185000, 'img' => '/images/venues/komorebi_2.jpg'],
                ],
            ],
            [
                'name' => 'PadelClub Senayan Arena',
                'description' => 'Venue padel standar internasional pertama di jantung kota Jakarta dengan 4 court berstandar World Padel Tour. Dilengkapi pencahayaan LED anti-glare, clubhouse mewah, cafe sehat, dan area shower ber-AC.',
                'address' => 'Gelora Bung Karno, Jl. Pintu Satu Senayan No. 1, Gelora, Tanah Abang',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'phone' => '021-5744001',
                'email' => 'senayan@padelcourt.id',
                'latitude' => -6.2185,
                'longitude' => 106.8024,
                'opening_time' => '06:00:00',
                'closing_time' => '23:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Pro Shop'],
                'cover_image' => '/images/venues/padel_senayan_arena.jpg',
                'images' => [
                    '/images/venues/senayan_1.jpg',
                    '/images/venues/senayan_2.jpg',
                    '/images/venues/senayan_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Center Court', 'type' => 'indoor', 'price_morning' => 150000, 'price_evening' => 180000, 'price_weekend' => 200000, 'img' => '/images/venues/senayan_1.jpg'],
                    ['name' => 'Court 02 — Arena', 'type' => 'indoor', 'price_morning' => 140000, 'price_evening' => 170000, 'price_weekend' => 190000, 'img' => '/images/venues/senayan_2.jpg'],
                    ['name' => 'Court 03 — Sunset', 'type' => 'outdoor', 'price_morning' => 120000, 'price_evening' => 150000, 'price_weekend' => 170000, 'img' => '/images/venues/senayan_3.jpg'],
                    ['name' => 'Court 04 — Garden', 'type' => 'outdoor', 'price_morning' => 120000, 'price_evening' => 150000, 'price_weekend' => 170000, 'img' => '/images/venues/senayan_4.jpg'],
                ],
            ],
            [
                'name' => 'Kemang Padel Hub',
                'description' => 'Tempat berkumpulnya komunitas padel Jakarta Selatan. Suasana santai dan trendi dengan fasilitas rooftop cafe, rental perlengkapan Bullpadel dan Nox, serta coaching clinic.',
                'address' => 'Jl. Kemang Raya No. 45B, Bangka, Mampang Prapatan',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'phone' => '021-7198002',
                'email' => 'kemang@padelcourt.id',
                'latitude' => -6.2738,
                'longitude' => 106.8152,
                'opening_time' => '07:00:00',
                'closing_time' => '23:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket'],
                'cover_image' => '/images/venues/padel_kemang_hub.jpg',
                'images' => [
                    '/images/venues/kemang_1.jpg',
                    '/images/venues/kemang_2.jpg',
                    '/images/venues/kemang_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Palm Court', 'type' => 'outdoor', 'price_morning' => 110000, 'price_evening' => 140000, 'price_weekend' => 160000, 'img' => '/images/venues/kemang_1.jpg'],
                    ['name' => 'Court 02 — Lounge Court', 'type' => 'outdoor', 'price_morning' => 110000, 'price_evening' => 140000, 'price_weekend' => 160000, 'img' => '/images/venues/kemang_2.jpg'],
                    ['name' => 'Court 03 — Elite Indoor', 'type' => 'indoor', 'price_morning' => 135000, 'price_evening' => 165000, 'price_weekend' => 185000, 'img' => '/images/venues/kemang_3.jpg'],
                ],
            ],
            [
                'name' => 'BSD City Padel Garden',
                'description' => 'Venue padel asri dikelilingi taman tropis di kawasan BSD City. Menyediakan lapangan indoor beratap tinggi dan outdoor berhawa sejuk dengan parkiran luas.',
                'address' => 'Jl. BSD Grand Boulevard, Pagedangan, BSD City',
                'city' => 'Tangerang Selatan',
                'province' => 'Banten',
                'phone' => '021-5379003',
                'email' => 'bsd@padelcourt.id',
                'latitude' => -6.3021,
                'longitude' => 106.6522,
                'opening_time' => '06:00:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Musholla'],
                'cover_image' => '/images/venues/padel_bsd_garden.jpg',
                'images' => [
                    '/images/venues/bsd_1.jpg',
                    '/images/venues/bsd_2.jpg',
                    '/images/venues/bsd_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Garden View', 'type' => 'outdoor', 'price_morning' => 100000, 'price_evening' => 130000, 'price_weekend' => 150000, 'img' => '/images/venues/bsd_1.jpg'],
                    ['name' => 'Court 02 — Lakeview', 'type' => 'outdoor', 'price_morning' => 100000, 'price_evening' => 130000, 'price_weekend' => 150000, 'img' => '/images/venues/bsd_2.jpg'],
                    ['name' => 'Court 03 — Pavilion Indoor', 'type' => 'indoor', 'price_morning' => 125000, 'price_evening' => 155000, 'price_weekend' => 175000, 'img' => '/images/venues/bsd_3.jpg'],
                ],
            ],
            [
                'name' => 'PadelClub Surabaya Barat',
                'description' => 'Pusat olahraga padel termegah di Jawa Timur. Menawarkan 3 lapangan berstandar internasional dengan sistem pencahayaan malam hari terbaik.',
                'address' => 'Jl. Mayjend Jonosewojo No. 88, Dukuh Pakis, Surabaya Barat',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'phone' => '031-7389004',
                'email' => 'surabaya@padelcourt.id',
                'latitude' => -7.2891,
                'longitude' => 112.6789,
                'opening_time' => '07:00:00',
                'closing_time' => '23:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket'],
                'cover_image' => '/images/venues/padel_surabaya_barat.jpg',
                'images' => [
                    '/images/venues/surabaya_1.jpg',
                    '/images/venues/surabaya_2.jpg',
                    '/images/venues/surabaya_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — West Grand Court', 'type' => 'indoor', 'price_morning' => 110000, 'price_evening' => 140000, 'price_weekend' => 160000, 'img' => '/images/venues/surabaya_1.jpg'],
                    ['name' => 'Court 02 — East Court', 'type' => 'indoor', 'price_morning' => 110000, 'price_evening' => 140000, 'price_weekend' => 160000, 'img' => '/images/venues/surabaya_2.jpg'],
                    ['name' => 'Court 03 — Sky Outdoor', 'type' => 'outdoor', 'price_morning' => 95000, 'price_evening' => 125000, 'price_weekend' => 145000, 'img' => '/images/venues/surabaya_3.jpg'],
                ],
            ],
            [
                'name' => 'Dago Highland Padel Club',
                'description' => 'Bermain padel di udara sejuk perbukitan Dago Bandung. Suasana tenang dan pemandangan kota Bandung yang memukau dari area lounge outdoor.',
                'address' => 'Jl. Ir. H. Juanda No. 390, Dago Atas, Coblong',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'phone' => '022-2509005',
                'email' => 'bandung@padelcourt.id',
                'latitude' => -6.8712,
                'longitude' => 107.6189,
                'opening_time' => '06:30:00',
                'closing_time' => '22:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket'],
                'cover_image' => '/images/venues/padel_dago_highland.jpg',
                'images' => [
                    '/images/venues/dago_1.jpg',
                    '/images/venues/dago_2.jpg',
                    '/images/venues/dago_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Mountain Breeze', 'type' => 'outdoor', 'price_morning' => 90000, 'price_evening' => 120000, 'price_weekend' => 140000, 'img' => '/images/venues/dago_1.jpg'],
                    ['name' => 'Court 02 — Pine Garden', 'type' => 'outdoor', 'price_morning' => 90000, 'price_evening' => 120000, 'price_weekend' => 140000, 'img' => '/images/venues/dago_2.jpg'],
                    ['name' => 'Court 03 — Highland Indoor', 'type' => 'indoor', 'price_morning' => 110000, 'price_evening' => 140000, 'price_weekend' => 160000, 'img' => '/images/venues/dago_3.jpg'],
                ],
            ],
            [
                'name' => 'Canggu Sanctuary Padel Bali',
                'description' => 'Destinasi padel tropis favorit di Canggu, Bali. Nikmati permainan padel berenergi tinggi dengan smoothie bar, kolam relaksasi, dan komunitas internasional yang hangat.',
                'address' => 'Jl. Pantai Batu Bolong No. 77, Canggu, Kuta Utara',
                'city' => 'Denpasar',
                'province' => 'Bali',
                'phone' => '0361-987006',
                'email' => 'bali@padelcourt.id',
                'latitude' => -8.6500,
                'longitude' => 115.1300,
                'opening_time' => '06:00:00',
                'closing_time' => '23:00:00',
                'facilities' => ['Parking', 'Shower', 'Locker', 'Cafe', 'WiFi', 'Rental Raket', 'Pro Shop'],
                'cover_image' => '/images/venues/padel_canggu_bali.jpg',
                'images' => [
                    '/images/venues/canggu_1.jpg',
                    '/images/venues/canggu_2.jpg',
                    '/images/venues/canggu_3.jpg',
                ],
                'courts' => [
                    ['name' => 'Court 01 — Sunset Arena', 'type' => 'outdoor', 'price_morning' => 130000, 'price_evening' => 160000, 'price_weekend' => 180000, 'img' => '/images/venues/canggu_1.jpg'],
                    ['name' => 'Court 02 — Island View', 'type' => 'outdoor', 'price_morning' => 130000, 'price_evening' => 160000, 'price_weekend' => 180000, 'img' => '/images/venues/canggu_2.jpg'],
                    ['name' => 'Court 03 — Breeze Indoor', 'type' => 'indoor', 'price_morning' => 150000, 'price_evening' => 180000, 'price_weekend' => 200000, 'img' => '/images/venues/canggu_3.jpg'],
                ],
            ],
        ];

        $allCourts = [];
        $createdVenues = [];

        foreach ($venuesData as $vd) {
            $courts = $vd['courts'];
            unset($vd['courts']);

            $venue = Venue::create($vd);
            $createdVenues[] = $venue;

            foreach ($courts as $cd) {
                $court = Court::create([
                    'venue_id' => $venue->id,
                    'name' => $cd['name'],
                    'type' => $cd['type'],
                    'description' => 'Spesifikasi standar WPT dengan kaca tempered 12mm dan rumput Mondo turf kualitas premium.',
                    'cover_image' => $cd['img'],
                    'status' => 'available',
                ]);
                $allCourts[] = $court;

                // Create pricing rules
                PricingRule::create([
                    'court_id' => $court->id,
                    'name' => 'Weekday Pagi',
                    'day_type' => 'weekday',
                    'start_time' => '06:00:00',
                    'end_time' => '17:00:00',
                    'price_per_hour' => $cd['price_morning'],
                ]);
                PricingRule::create([
                    'court_id' => $court->id,
                    'name' => 'Weekday Malam',
                    'day_type' => 'weekday',
                    'start_time' => '17:00:00',
                    'end_time' => '23:00:00',
                    'price_per_hour' => $cd['price_evening'],
                ]);
                PricingRule::create([
                    'court_id' => $court->id,
                    'name' => 'Weekend',
                    'day_type' => 'weekend',
                    'start_time' => '06:00:00',
                    'end_time' => '23:00:00',
                    'price_per_hour' => $cd['price_weekend'],
                ]);
            }
        }

        // 3. Promos
        $promosData = [
            ['code' => 'PADELNEW50', 'name' => 'Diskon Member Baru Rp50.000', 'description' => 'Potongan Rp50.000 untuk pengguna baru pertama kali booking', 'type' => 'fixed', 'value' => 50000, 'min_transaction' => 100000, 'max_uses' => 1000],
            ['code' => 'WEEKEND20', 'name' => 'Voucher Akhir Pekan 20%', 'description' => 'Diskon 20% untuk booking di hari Sabtu & Minggu', 'type' => 'percentage', 'value' => 20, 'max_discount' => 50000, 'min_transaction' => 120000, 'max_uses' => 500],
            ['code' => 'SMASH100', 'name' => 'Grand Smash Diskon Rp100.000', 'description' => 'Potongan harga Rp100.000 untuk booking dengan minimal transaksi Rp300.000', 'type' => 'fixed', 'value' => 100000, 'min_transaction' => 300000, 'max_uses' => 500],
            ['code' => 'COMMUNITY15', 'name' => 'Diskon Komunitas Padel 15%', 'description' => 'Diskon 15% spesial komunitas padel di seluruh venue', 'type' => 'percentage', 'value' => 15, 'max_discount' => 45000, 'min_transaction' => 150000, 'max_uses' => 500],
            ['code' => 'FIRSTGAME', 'name' => 'Diskon Booking Pertama', 'description' => 'Potongan Rp50.000 untuk pengguna baru pertama kali booking', 'type' => 'fixed', 'value' => 50000, 'min_transaction' => 100000, 'max_uses' => 500],
            ['code' => 'SMASH10', 'name' => 'Flash Sale 10%', 'description' => 'Diskon 10% untuk semua lapangan kapan saja', 'type' => 'percentage', 'value' => 10, 'max_discount' => 25000, 'min_transaction' => 100000, 'max_uses' => 1000],
            ['code' => 'PADEL50', 'name' => 'Kupon Hemat Rp50.000', 'description' => 'Potongan langsung Rp50.000 minimal transaksi Rp250.000', 'type' => 'fixed', 'value' => 50000, 'min_transaction' => 250000, 'max_uses' => 200],
            ['code' => 'RALLYDAY', 'name' => 'Rally Day Promo 15%', 'description' => 'Diskon 15% setiap hari Selasa dan Kamis', 'type' => 'percentage', 'value' => 15, 'max_discount' => 30000, 'min_transaction' => 150000, 'max_uses' => 250],
            ['code' => 'CLUBMEMBER', 'name' => 'Member Club Eksklusif 25%', 'description' => 'Diskon 25% spesial member komunitas padel', 'type' => 'percentage', 'value' => 25, 'max_discount' => 60000, 'min_transaction' => 200000, 'max_uses' => 150],
            ['code' => 'JAKARTAPADEL', 'name' => 'Spesial Jakarta Rp35.000', 'description' => 'Potongan harga untuk venue di area Jakarta', 'type' => 'fixed', 'value' => 35000, 'min_transaction' => 120000, 'max_uses' => 400],
            ['code' => 'BALISUNSET', 'name' => 'Bali Sunset Special 20%', 'description' => 'Potongan 20% main sore di venue Canggu Bali', 'type' => 'percentage', 'value' => 20, 'max_discount' => 50000, 'min_transaction' => 150000, 'max_uses' => 300],
            ['code' => 'SURABAYAPLAY', 'name' => 'Surabaya Play Rp30.000', 'description' => 'Potongan hemat khusus venue Surabaya Barat', 'type' => 'fixed', 'value' => 30000, 'min_transaction' => 100000, 'max_uses' => 300],
            ['code' => 'BANDUNGBREEZE', 'name' => 'Bandung Breeze 15%', 'description' => 'Diskon 15% khusus venue Dago Highland & Komorebi', 'type' => 'percentage', 'value' => 15, 'max_discount' => 35000, 'min_transaction' => 100000, 'max_uses' => 300],
        ];

        $createdPromos = [];
        foreach ($promosData as $pd) {
            $createdPromos[] = Promo::create([
                'code' => $pd['code'],
                'name' => $pd['name'],
                'description' => $pd['description'],
                'type' => $pd['type'],
                'value' => $pd['value'],
                'max_discount' => $pd['max_discount'] ?? null,
                'min_transaction' => $pd['min_transaction'],
                'max_uses' => $pd['max_uses'],
                'max_uses_per_user' => 2,
                'valid_from' => now()->subDays(30),
                'valid_until' => now()->addMonths(6),
                'is_active' => true,
            ]);
        }

        // 4. Bookings, Payments, and Reviews
        $paymentMethods = ['bank_transfer', 'e_wallet', 'virtual_account', 'credit_card', 'cash'];
        $reviewComments = [
            'Lapangannya sangat bersih, pencahayaan malam hari mantap banget!',
            'Fasilitas loker dan kamar bilas ber-AC sangat nyaman. Bakal langganan main di sini.',
            'Rumput Mondo-nya masih empuk dan raket sewaannya bagus-bagus.',
            'Pelayanan staff ramah dan cepat. Proses check-in pakai QR code sangat praktis.',
            'Tempat favorit bareng teman-teman kantor tiap pulang kerja. Cafe-nya juga enak!',
            'Venue padel terbaik di Indonesia sejauh ini. Glass wall-nya bening dan kokoh.',
            'Suasana menyenangkan, parkir luas dan akses sangat mudah.',
            'Sangat recommended buat pemula maupun yang sudah pro. Jadwal selalu rapi.',
            'AC indoor dingin dan sirkulasi udaranya sangat baik saat main siang hari.',
            'Pemandangan sore hari bagus banget dari area rooftop/lounge-nya.',
        ];

        $bookingCount = 1;

        // Seed 22 completed bookings in the past (with reviews)
        for ($i = 20; $i >= 1; $i--) {
            $customer = $customers[$i % count($customers)];
            $court = $allCourts[$i % count($allCourts)];
            $date = now()->subDays($i)->format('Y-m-d');
            $startHour = 8 + ($i % 12);
            $startTime = sprintf('%02d:00:00', $startHour);
            $duration = ($i % 2 === 0) ? 2 : 1;
            $endTime = sprintf('%02d:00:00', $startHour + $duration);
            $subtotal = 140000 * $duration;
            $serviceFee = 5000;
            $promo = ($i % 3 === 0) ? $createdPromos[$i % count($createdPromos)] : null;
            $discount = $promo ? ($promo->type === 'fixed' ? $promo->value : ($subtotal * 0.15)) : 0;
            $total = max(0, $subtotal + $serviceFee - $discount);

            $code = 'PC-' . date('Y') . '-' . str_pad($bookingCount++, 6, '0', STR_PAD_LEFT);

            $booking = Booking::create([
                'booking_code' => $code,
                'user_id' => $customer->id,
                'venue_id' => $court->venue_id,
                'court_id' => $court->id,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_hours' => $duration,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'discount' => $discount,
                'total' => $total,
                'promo_id' => $promo?->id,
                'status' => 'completed',
                'created_at' => now()->subDays($i)->subHours(2),
            ]);

            // Payment
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $total,
                'method' => $paymentMethods[$i % count($paymentMethods)],
                'status' => 'paid',
                'paid_at' => now()->subDays($i)->subHours(2),
            ]);

            if ($promo) {
                PromoUsage::create([
                    'promo_id' => $promo->id,
                    'user_id' => $customer->id,
                    'booking_id' => $booking->id,
                    'discount_amount' => $discount,
                ]);
            }

            // Create Review for this completed booking
            Review::create([
                'user_id' => $customer->id,
                'venue_id' => $court->venue_id,
                'booking_id' => $booking->id,
                'rating' => ($i % 5 === 0) ? 4 : 5,
                'comment' => $reviewComments[$i % count($reviewComments)],
                'is_published' => true,
                'created_at' => now()->subDays($i)->addHours(3),
            ]);
        }

        // Seed 10 confirmed upcoming bookings (today and next few days)
        for ($i = 0; $i < 10; $i++) {
            $customer = $customers[$i % count($customers)];
            $court = $allCourts[($i + 3) % count($allCourts)];
            $date = now()->addDays(floor($i / 3))->format('Y-m-d');
            $startHour = 9 + (($i * 2) % 11);
            $startTime = sprintf('%02d:00:00', $startHour);
            $duration = 2;
            $endTime = sprintf('%02d:00:00', $startHour + $duration);
            $subtotal = 150000 * $duration;
            $serviceFee = 5000;
            $total = $subtotal + $serviceFee;

            $code = 'PC-' . date('Y') . '-' . str_pad($bookingCount++, 6, '0', STR_PAD_LEFT);

            $booking = Booking::create([
                'booking_code' => $code,
                'user_id' => $customer->id,
                'venue_id' => $court->venue_id,
                'court_id' => $court->id,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_hours' => $duration,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'discount' => 0,
                'total' => $total,
                'status' => 'confirmed',
                'created_at' => now()->subHours(5),
            ]);

            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $total,
                'method' => $paymentMethods[$i % count($paymentMethods)],
                'status' => 'paid',
                'paid_at' => now()->subHours(5),
            ]);
        }

        // Seed 5 pending bookings
        for ($i = 0; $i < 5; $i++) {
            $customer = $customers[($i + 5) % count($customers)];
            $court = $allCourts[($i + 7) % count($allCourts)];
            $date = now()->addDays(2 + $i)->format('Y-m-d');
            $startHour = 14 + $i;
            $startTime = sprintf('%02d:00:00', $startHour);
            $duration = 1;
            $endTime = sprintf('%02d:00:00', $startHour + $duration);
            $subtotal = 160000;
            $serviceFee = 5000;
            $total = $subtotal + $serviceFee;

            $code = 'PC-' . date('Y') . '-' . str_pad($bookingCount++, 6, '0', STR_PAD_LEFT);

            $booking = Booking::create([
                'booking_code' => $code,
                'user_id' => $customer->id,
                'venue_id' => $court->venue_id,
                'court_id' => $court->id,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_hours' => $duration,
                'subtotal' => $subtotal,
                'service_fee' => $serviceFee,
                'discount' => 0,
                'total' => $total,
                'status' => 'pending',
                'created_at' => now()->subMinutes(15),
            ]);

            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $total,
                'method' => 'bank_transfer',
                'status' => 'pending',
            ]);
        }

        // Seed 3 cancelled bookings
        for ($i = 0; $i < 3; $i++) {
            $customer = $customers[($i + 10) % count($customers)];
            $court = $allCourts[($i + 2) % count($allCourts)];
            $date = now()->subDays(5 + $i)->format('Y-m-d');
            $startTime = '10:00:00';
            $duration = 1;
            $endTime = '11:00:00';
            $total = 145000;

            $code = 'PC-' . date('Y') . '-' . str_pad($bookingCount++, 6, '0', STR_PAD_LEFT);

            $booking = Booking::create([
                'booking_code' => $code,
                'user_id' => $customer->id,
                'venue_id' => $court->venue_id,
                'court_id' => $court->id,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_hours' => $duration,
                'subtotal' => 140000,
                'service_fee' => 5000,
                'discount' => 0,
                'total' => $total,
                'status' => 'cancelled',
                'cancellation_reason' => 'Ada keperluan mendadak di kantor.',
                'cancelled_at' => now()->subDays(6),
                'created_at' => now()->subDays(7),
            ]);
        }
    }
}
