///////////////////////EVENTS API//////////////////////////
// events.get_artist_by_name('Metallica');
// events.get_venue_by_name('Commodore');
// events.get_events_by_venue_id(3816);
///////////////////////EVENTS API//////////////////////////

import React, {Component} from 'react';
import EventsAPI from './events.js';
import SearchBar from './SearchBar.jsx';
const events = new EventsAPI();

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      eventTypeSearch: '',
      queryResults: [],
      eventResults: []
    }
  }

  // Once event button is clicked set its type to state {either Artist or Venue}
  handleEventTypeButtons = (eventType) => {
    this.setState({eventTypeSearch: eventType})
  }

  // Take search input and store in state {name of either Artist or Venue}
  handleSearch = (input) => { // Get first query jamBase to get list of names & ids
    if ( this.state.eventTypeSearch === 'Venues' ){
      this.queryVenues(input);
    } else {
      this.queryArtists(input);
    }
  }

  // First query for selecting a list of venues or artists to select from
  queryVenues = async (name) => {
    const queryResults = await events.get_venue_by_name(name);
    this.setState( { queryResults: queryResults.Venues } );
  }

  queryArtists = async (name) => {
    const queryResults = await events.get_artist_by_name(name);
    this.setState( { queryResults: queryResults.Artists } );
  }

  // Second query for displaying information in the Modal
  queryById = async (id) => { // Get a name as input and queries for a list of matching names and their ids
    const type = this.state.eventTypeSearch;
    let eventResults = {};
    if ( type === 'Venues' ){
      eventResults = await events.get_events_by_venue_id(id);
      this.setState( { eventResults } );
    } else {
      eventResults = await events.get_events_by_artist_id(id);
      this.setState( { eventResults } );
    }
  }

  // 2nd query  -> id is name that is clicked
  openModal = async (id) => {
    await this.queryById(id);
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    // Initial State
    if ( this.state.queryResults === null ) {
      return (
        <div className='events'>
          <SearchBar handleSearch={this.handleSearch} />
          <EventTypeButtons handleEventTypeButtons={this.handleEventTypeButtons} />
        </div>
      )
    } else if (this.state.queryResults.length !== 0 && (this.state.eventResults.length === 0)) {
      // When Search result is received and first query is complete save data
      const queryResultsList = (this.state.queryResults).map(item =>
        <EventsListClick
          key={item.Id}
          id={item.Id}
          item={item}
          currentEvent={this.state.eventTypeSearch}
          openModal={this.openModal}
        />);
      // Render the list of results from first query
      return (
        <div className='events'>
          <SearchBar handleSearch={this.handleSearch} />
          <EventTypeButtons handleEventTypeButtons={this.handleEventTypeButtons} />
          {queryResultsList}
        </div>
      )
    } else {
      // Open Modal when user clicks on name
      return (
        <div className='events'>
          <SearchBar handleSearch={this.handleSearch} />
          <EventTypeButtons handleEventTypeButtons={this.handleEventTypeButtons} />
          <EventsModal isOpen={this.state.isModalOpen} onClose={this.closeModal} events={this.state.eventResults.Events} currentEvent={this.state.eventTypeSearch} />
        </div>
      )
    } // End of if
  } // End of Render
}

// Wait for user to select Artist or Venue
class EventsListClick extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
    e.stopPropagation();
    this.props.openModal(this.props.id);
  }

  render() {
    if (this.props.currentEvent === 'Venues') {
      return (
        <div className='events-venues'>
          <ul onClick={this.handleClick}>
            {this.props.item.Name}
            <li>
              {this.props.item.City}
              {this.props.item.State}
              {this.props.item.Country}
            </li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className='events-artists'>
          <ul onClick={this.handleClick}>
            {this.props.item.Name}
          </ul>
        </div>
      )
    } // End of if
  } // End of Render
} // End of EventsListClick

// Modal to display information from second query
class EventsModal extends Component {
  constructor(props) {
    super(props);
  }

  close = (e) => {
    e.preventDefault()

    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    if (this.props.isOpen === false) return null;
    const eventResults = this.props.events; // [{}] -> events={this.state.eventResults.Events} -> [{Artists}, {Venues}]
    if (this.props.currentEvent === 'Venues') {
      const eventDetails = eventResults.map(event => {  // loop through each object
        let event_id, date, ticket_url;
        let artist_name = [];
        event_id = event.Id;
        date = event.Date.replace(/T\d{2}:\d{2}:\d{2}/,'').trim();
        ticket_url = event.TicketUrl;
        event.Artists.map(artist => {
          artist_name.push(artist.Name.trim());
        });
        artist_name = artist_name.join(', ');
        // Create a row with all the information for each event
        return (
          <tr key={event_id}>
            <td>{date}</td>
            <td>{artist_name}</td>
            <td><a href={this.props.ticket_url}>Buy</a></td>
          </tr>
        )
      }); // End of eventDetails map
      // Create table
      return (
        <div>
          <div className='events-backdrop' onClick={this.close}></div>
          <div className='events-modal'>
            <table id='gradient-style' summary='Venue Results'>
              <thead>
                <tr>
                  <th scope='col'>Date</th>
                  <th scope='col'>Artist Name</th>
                  <th scope='col'>Tickets</th>
                </tr>
              </thead>
              <tbody>{eventDetails}</tbody>
              <tfoot><tr><td colSpan='3'>Thank you for visiting our website!</td></tr></tfoot>
            </table>
          </div>
        </div>
      )
    } else {  // If its Artists
      const eventDetails = eventResults.map(event => {
        let event_id, date, ticket_url, venue_name, city_name, country_code, state_code;
        for ({ Date, TicketUrl, Venue } in event) {
          event_id = event.Id;
          date = event.Date.replace(/T\d{2}:\d{2}:\d{2}/,'').trim();
          ticket_url = event.TicketUrl;
          Object.keys(event.Venue).map(({Name, City, StateCode, CountryCode}) => {
            venue_name = event.Venue.Name.trim();
            city_name = event.Venue.City.trim();
            state_code = event.Venue.StateCode.trim();
            country_code = event.Venue.CountryCode.trim();
          });
          return <CustomTable key={event_id} date={date} venue_name={venue_name} city_name={city_name} state_code={state_code} country_code={country_code} ticket_url={ticket_url} />
        }
      });
      return (
        <div>
          <div className='events-backdrop' onClick={this.close}></div>
          <div className='events-modal'>
            <table id='gradient-style' summary='Venue Results'>
              <thead>
                <tr>
                  <th scope='col'>Date</th>
                  <th scope='col'>Venue Name</th>
                  <th scope='col'>City Name</th>
                  <th scope='col'>State</th>
                  <th scope='col'>Country</th>
                  <th scope='col'>Tickets</th>
                </tr>
              </thead>
              <tbody>{eventDetails}</tbody>
              <tfoot><tr><td colSpan='6'>Thank you for visiting our website!</td></tr></tfoot>
            </table>
          </div>
        </div>
      )
    } // End of If
  } // End of Render
} // End of Modal component

// Rows for each Artist
class CustomTable extends Component {
  render(){
    return (
      <tr key={this.props.event_id}>
        <td>{this.props.date}</td>
        <td>{this.props.venue_name}</td>
        <td>{this.props.city_name}</td>
        <td>{this.props.state_code}</td>
        <td>{this.props.country_code}</td>
        <td><a href={this.props.ticket_url}>Buy</a></td>
      </tr>
    );
  }
}

// To get information on which event is desired -> Either Venue || Artist
class EventTypeButtons extends Component {
  formSelector = (event) => {
    const eventType = event.target.className.split(' ')[1];
    this.props.handleEventTypeButtons(eventType);
  }
  render(){
    return (
      <div>
        <h1>Events</h1>
        <span className='form-venueBtn Venues' onClick={this.formSelector}>By Venue</span>
        <span className='form-artistBtn Artists' onClick={this.formSelector}>By Artist</span>
      </div>
    );
  }
}

export default Events;
