import React, { useState } from 'react';
import {
  Container,
  Card,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import { fetchAi } from '../resume/AISuggestions';
import MapFlow from './MapFlow';

const formFields = [
  { label: 'From', name: 'from', type: 'text' },
  { label: 'Destination', name: 'destination', type: 'text' },
  { label: 'Start Date', name: 'startDate', type: 'datetime-local' },
  { label: 'Return Date', name: 'returnDate', type: 'datetime-local' },
  { label: 'Number of Travelers', name: 'travelers', type: 'number' },
  {
    label: 'Preferred Locations (Optional)',
    name: 'preferredLocations',
    type: 'text',
  },
  { label: 'Expected Budget (per person)', name: 'budget', type: 'number' },
];

const selectFields = [
  {
    label: 'Trip Type',
    name: 'tripType',
    options: ['Solo', 'Friends', 'Family', 'Business'],
  },
  {
    label: 'Preferred Transport',
    name: 'transport',
    options: ['Flight', 'Train', 'Bus', 'Own Car'],
  },
];

const HeroSection = styled('div')({
  backgroundImage: `url(https://png.pngtree.com/thumb_back/fh260/background/20240916/pngtree-ultimate-travel-planner-crafting-custom-itineraries-mapping-your-adventures-and-expert-image_16219023.jpg)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '50vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  textAlign: 'center',
  fontSize: '2rem',
fontWeight: 'bold',
  textShadow: '2px 2px 10px rgba(0,0,0,0.6)',
});

const ItineraryForm = () => {
  const [formData, setFormData] = useState({});
  const [itineraryPlan, setItineraryPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prompt = `
Generate a detailed, budget-friendly travel itinerary for a trip to ${formData.destination} from ${formData.startDate} to ${formData.returnDate}, ensuring all expenses remain within the allocated budget of ${formData.budget} per person.

Each day's itinerary should be realistic and cost-conscious, considering:

Start Date & Time: ${formData.startDate}

Return Date: ${formData.returnDate}

Number of Travelers: ${formData.travelers}

Total Budget: ${formData.budget} per person

Preferred Transportation: ${formData.transport} (Include current train/flight schedules with prices and booking links)

For each day, the itinerary should include:

1. Morning Activity:
Place to Visit: Name with a detailed description (history, significance, unique aspects).

Time Required: Estimated duration.

Entry Fee: Cost per person (ensure it fits the budget).

Parking Availability: Details and costs (if applicable).

Travel Time: From accommodation to the site.

Budget-Friendly Alternatives: If the cost is high, suggest a free/cheaper alternative.

Booking Link: Direct URL for ticket purchase.

2. Lunch:
Restaurant Name: With address.

Menu Highlights: Popular dishes with cost per person (stay within budget).

Booking Link: Reservation URL if available.

3. Afternoon Activity:
Place to Visit: Name with a detailed description (history, attractions, unique experiences).

Time Required: Estimated duration.

Entry Fee: Cost per person (ensure it stays within budget).

Parking Availability: Details and costs (if applicable).

Travel Time: From lunch location to the site.

Budget-Friendly Alternatives: Suggest a free/cheaper alternative if necessary.

Booking Link: Direct URL for ticket purchase.

4. Evening Activity:
Place to Visit: Name with a detailed description (why it's worth visiting).

Time Required: Estimated duration.

Entry Fee: Cost per person (ensure it stays within budget).

Parking Availability: Details and costs (if applicable).

Travel Time: From previous location to the site.

Budget-Friendly Alternatives: If it's expensive, suggest an alternative.

Booking Link: Direct URL for ticket purchase.

5. Dinner:
Restaurant Name: With address.

Menu Highlights: Popular dishes with cost per person (budget-conscious).

Booking Link: Reservation URL if available.

6. Accommodation:
Hotel Name: With address.

Price per Night: Cost per room (ensure affordability).

Check-in/Check-out Times: Specific timings.

Amenities: List of available facilities.

Booking Link: Direct URL for reservation.

7. Transportation Details:
Mode: Flight, train, taxi, etc.

Departure & Arrival Times: Specific timings.

Duration: Total travel time.

Cost per Person: Ticket price (within budget).

Booking Link: Direct URL for ticket purchase.

8. Estimated Daily Cost Breakdown:
Transportation: Total cost per person.

Activities: Total entry fees per person.

Food: Total cost per person.

Accommodation: Total cost per night per person.

Miscellaneous: Any additional expenses.

Total Daily Cost: Ensure the total does not exceed ${formData.budget} per person.

Note: The currency should be based on the country's local currency.

Provide the response in JSON format with day-wise and activity-wise separation:

{
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Visit XYZ Museum",
          "description": "XYZ Museum is a world-renowned cultural center featuring historical artifacts, interactive exhibits, and an immersive VR tour of ancient civilizations.",
          "location": "XYZ Street",
          "entry_fee": "$10",
          "transport": "Walk",
          "duration": "2 hours",
          "parking": "Available, $5 per hour",
          "budget_friendly_alternative": "Free city park nearby with historical statues",
          "booking_link": "https://xyzmuseum.com/tickets"
        }
      ],
      "food": {
        "lunch": {
          "restaurant": "ABC Cafe",
          "location": "ABC Street",
          "cost": "$12 per person",
          "menu_highlights": ["Pasta", "Grilled Chicken", "Vegan Options"],
          "booking_link": "https://abccafe.com/reservations"
        },
        "dinner": {
          "restaurant": "DEF Dine",
          "location": "DEF Street",
          "cost": "$18 per person",
          "menu_highlights": ["Seafood Platter", "Steak", "Wine Selection"],
          "booking_link": "https://defdine.com/reservations"
        }
      },
      "accommodation": {
        "hotel": "Luxury Inn",
        "location": "Hotel Street",
        "price_per_night": "$80",
        "check_in": "2:00 PM",
        "check_out": "11:00 AM",
        "amenities": ["Free Wi-Fi", "Breakfast Included", "Pool"],
        "booking_link": "https://luxuryinn.com/book"
      },
      "transportation": {
        "mode": "Flight",
        "departure": "10:00 AM",
        "arrival": "12:00 PM",
        "duration": "2 hours",
        "cost_per_person": "$180",
        "booking_link": "https://flights.com/book"
      },
      "total_cost": {
        "transportation": "$180",
        "activities": "$10",
        "food": "$30",
        "accommodation": "$80",
        "miscellaneous": "$10",
        "total_daily_cost": "$310"
      }
    }
  ]
}
`;

    const response = await fetchAi(prompt);
    console.log(response);
    setLoading(false);
    setItineraryPlan(JSON.parse(response));
  };

  return (
    <>
      <Container>
        <HeroSection>Plan Your Dream Trip Effortlessly!</HeroSection>
        <Card
          sx={{ padding: 4, boxShadow: 5, marginTop: -5, background: '#fff' }}
        >
          <Typography variant="h5" gutterBottom>
            Enter Your Travel Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {selectFields.map(({ label, name, options }) => (
                <Grid item xs={12} md={6} key={name}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>{label}</InputLabel>
                    <Select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option.toLowerCase()}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
              {formFields.map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: 3,
                background: 'linear-gradient(45deg, #2193b0, #6dd5ed)',
                color: '#fff',
              }}
            >
              {loading ? 'Generating...' : 'Generate My Itinerary'}
            </Button>
          </form>
        </Card>
      </Container>
      <MapFlow />
      {itineraryPlan && <MapFlow tripData={itineraryPlan} />}
    </>
  );
};

export default ItineraryForm;
