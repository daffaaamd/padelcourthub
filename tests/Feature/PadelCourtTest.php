<?php

namespace Tests\Feature;

use App\Models\Court;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PadelCourtTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_loads_successfully(): void
    {
        $venue = Venue::create([
            'name' => 'PadelClub Test',
            'slug' => 'padelclub-test',
            'city' => 'Jakarta Selatan',
            'address' => 'Jl. Test No. 1',
            'opening_time' => '07:00:00',
            'closing_time' => '23:00:00',
            'facilities' => ['Parking', 'Shower'],
            'is_active' => true,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_courts_page_loads_successfully(): void
    {
        $response = $this->get('/courts');
        $response->assertStatus(200);
    }

    public function test_venues_page_loads_successfully(): void
    {
        $response = $this->get('/venues');
        $response->assertStatus(200);
    }

    public function test_promos_page_loads_successfully(): void
    {
        $response = $this->get('/promos');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer)->get('/admin');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_promo_validate_api_calculates_discount(): void
    {
        \App\Models\Promo::create([
            'code' => 'TEST50',
            'name' => 'Test Promo 50k',
            'type' => 'fixed',
            'value' => 50000,
            'min_transaction' => 100000,
            'max_uses' => 100,
            'used_count' => 0,
            'max_uses_per_user' => 1,
            'valid_from' => now()->subDay(),
            'valid_until' => now()->addDays(30),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/promos/validate', [
            'code' => 'TEST50',
            'amount' => 150000,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'valid' => true,
                'discount' => 50000,
            ]);
    }

    public function test_promo_validate_rejects_invalid_code(): void
    {
        $response = $this->postJson('/api/promos/validate', [
            'code' => 'FAKECODE99',
            'amount' => 150000,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'valid' => false,
            ]);
    }

    public function test_court_availability_api_returns_available_slots(): void
    {
        $venue = Venue::create([
            'name' => 'PadelClub Test Availability',
            'slug' => 'padelclub-test-availability',
            'city' => 'Jakarta Selatan',
            'address' => 'Jl. Test No. 2',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court A',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        \App\Models\PricingRule::create([
            'court_id' => $court->id,
            'name' => 'Standard',
            'day_type' => 'all',
            'start_time' => '07:00:00',
            'end_time' => '22:00:00',
            'price_per_hour' => 150000,
        ]);

        $futureDate = now()->addDays(2)->toDateString();
        $response = $this->getJson("/api/courts/{$court->id}/availability?date={$futureDate}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'court_id',
                'date',
                'slots' => [
                    '*' => ['time', 'start', 'end', 'status', 'available', 'price']
                ]
            ]);

        $slots = $response->json('slots');
        $this->assertNotEmpty($slots);
        $this->assertTrue($slots[0]['available']);
    }

    public function test_booking_store_with_decimal_duration(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Test Booking',
            'slug' => 'padelclub-test-booking',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 3',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 01',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        \App\Models\PricingRule::create([
            'court_id' => $court->id,
            'name' => 'Standard Rate',
            'day_type' => 'all',
            'start_time' => '07:00:00',
            'end_time' => '22:00:00',
            'price_per_hour' => 150000,
        ]);

        $futureDate = now()->addDays(3)->toDateString();

        $response = $this->actingAs($user)->post('/booking', [
            'court_id' => $court->id,
            'date' => $futureDate,
            'start_time' => '09:00',
            'duration_hours' => 1.5,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('bookings', [
            'court_id' => $court->id,
            'user_id' => $user->id,
            'start_time' => '09:00:00',
            'end_time' => '10:30:00',
            'duration_hours' => 1.5,
            'subtotal' => 225000,
        ]);
    }

    public function test_booking_store_with_promo_code(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Test Promo Booking',
            'slug' => 'padelclub-test-promo-booking',
            'city' => 'Jakarta Selatan',
            'address' => 'Jl. Test No. 4',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 02',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        \App\Models\PricingRule::create([
            'court_id' => $court->id,
            'name' => 'Standard Rate',
            'day_type' => 'all',
            'start_time' => '07:00:00',
            'end_time' => '22:00:00',
            'price_per_hour' => 150000,
        ]);

        $promo = \App\Models\Promo::create([
            'code' => 'PADEL50K',
            'name' => 'Diskon 50k',
            'type' => 'fixed',
            'value' => 50000,
            'min_transaction' => 100000,
            'max_uses' => 100,
            'used_count' => 0,
            'max_uses_per_user' => 1,
            'valid_from' => now()->subDay(),
            'valid_until' => now()->addDays(30),
            'is_active' => true,
        ]);

        $futureDate = now()->addDays(3)->toDateString();

        $response = $this->actingAs($user)->post('/booking', [
            'court_id' => $court->id,
            'date' => $futureDate,
            'start_time' => '10:00',
            'duration_hours' => 1,
            'promo_code' => 'PADEL50K',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('bookings', [
            'court_id' => $court->id,
            'user_id' => $user->id,
            'promo_id' => $promo->id,
            'discount' => 50000,
        ]);
    }

    public function test_checkout_page_renders_successfully(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Test Checkout',
            'slug' => 'padelclub-test-checkout',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 5',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 03',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        $booking = \App\Models\Booking::create([
            'booking_code' => 'PC-TEST-001',
            'user_id' => $user->id,
            'court_id' => $court->id,
            'venue_id' => $venue->id,
            'date' => now()->addDays(2)->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'duration_hours' => 1,
            'subtotal' => 150000,
            'service_fee' => 5000,
            'discount' => 0,
            'total' => 155000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->get("/booking/{$booking->booking_code}/checkout");
        $response->assertStatus(200);
    }

    public function test_payment_process_and_confirmation_renders(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Test Pay',
            'slug' => 'padelclub-test-pay',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 6',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 04',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        $booking = \App\Models\Booking::create([
            'booking_code' => 'PC-TEST-002',
            'user_id' => $user->id,
            'court_id' => $court->id,
            'venue_id' => $venue->id,
            'date' => now()->addDays(2)->toDateString(),
            'start_time' => '14:00:00',
            'end_time' => '15:00:00',
            'duration_hours' => 1,
            'subtotal' => 150000,
            'service_fee' => 5000,
            'discount' => 0,
            'total' => 155000,
            'status' => 'pending',
        ]);

        \App\Models\Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->total,
            'status' => 'pending',
        ]);

        $payResponse = $this->actingAs($user)->post("/booking/{$booking->booking_code}/pay", [
            'payment_method' => 'bank_transfer',
        ]);

        $payResponse->assertRedirect(route('bookings.confirmation', $booking->booking_code));

        $confirmResponse = $this->actingAs($user)->get("/booking/{$booking->booking_code}/confirmation");
        $confirmResponse->assertStatus(200);
    }

    public function test_bookings_index_renders_successfully(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Test Index',
            'slug' => 'padelclub-test-index',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 7',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 05',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        \App\Models\Booking::create([
            'booking_code' => 'PC-TEST-003',
            'user_id' => $user->id,
            'court_id' => $court->id,
            'venue_id' => $venue->id,
            'date' => now()->addDays(1)->toDateString(),
            'start_time' => '16:00:00',
            'end_time' => '17:00:00',
            'duration_hours' => 1,
            'subtotal' => 150000,
            'service_fee' => 5000,
            'discount' => 0,
            'total' => 155000,
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($user)->get(route('bookings.index'));
        $response->assertStatus(200);
    }

    public function test_user_can_cancel_pending_booking(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Cancel Test',
            'slug' => 'padelclub-cancel-test',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 8',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 06',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        $booking = \App\Models\Booking::create([
            'booking_code' => 'PC-CANCEL-001',
            'user_id' => $user->id,
            'court_id' => $court->id,
            'venue_id' => $venue->id,
            'date' => now()->toDateString(),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'duration_hours' => 1,
            'subtotal' => 150000,
            'service_fee' => 5000,
            'discount' => 0,
            'total' => 155000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post(route('bookings.cancel', $booking->booking_code), [
            'reason' => 'Ada keperluan mendadak',
        ]);

        $response->assertRedirect(route('bookings.index'));
        $this->assertEquals('cancelled', $booking->fresh()->status);
        $this->assertNotNull($booking->fresh()->cancelled_at);
    }

    public function test_user_can_cancel_future_confirmed_booking(): void
    {
        $user = User::factory()->create();
        $venue = Venue::create([
            'name' => 'PadelClub Cancel Test 2',
            'slug' => 'padelclub-cancel-test-2',
            'city' => 'Jakarta Barat',
            'address' => 'Jl. Test No. 9',
            'opening_time' => '07:00:00',
            'closing_time' => '22:00:00',
            'facilities' => ['Parking'],
            'is_active' => true,
        ]);

        $court = Court::create([
            'venue_id' => $venue->id,
            'name' => 'Court 07',
            'type' => 'indoor',
            'status' => 'available',
        ]);

        $booking = \App\Models\Booking::create([
            'booking_code' => 'PC-CANCEL-002',
            'user_id' => $user->id,
            'court_id' => $court->id,
            'venue_id' => $venue->id,
            'date' => now()->addDays(2)->toDateString(),
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'duration_hours' => 2,
            'subtotal' => 300000,
            'service_fee' => 5000,
            'discount' => 0,
            'total' => 305000,
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($user)->post(route('bookings.cancel', $booking->booking_code));

        $response->assertRedirect(route('bookings.index'));
        $this->assertEquals('cancelled', $booking->fresh()->status);
    }
}

