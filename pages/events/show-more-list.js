export default {
  created: {
    upcoming: { eventType: 'created', typeParam: 'created', pageTitle: 'My Events' },
    past: { eventType: 'created', typeParam: 'created_past', pageTitle: 'My Events' },
  }, 
  rsvped: {
    upcoming: { eventType: 'rsvped', typeParam: 'rsvped', pageTitle: "RSVP'd" },
    past: { eventType: 'rsvped', typeParam: 'rsvped_past', pageTitle: "RSVP'd" },
  }, 
  viewed: { eventType: 'viewed', typeParam: 'viewed', pageTitle: "Recently Viewed" }
}