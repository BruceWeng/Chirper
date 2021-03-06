var React = require('react');
var ReactRouter = require('react-router'); // allow us to write route in jsx format
var Route = ReactRouter.Route;
var API = require('./api');

var routes = (<Route handler={require('./components/App')}>
    <Route name='home' path='/' handler={require('./components/Home')} />
    <Route name='users' handler={require('./components/UserList')} />
    <Route name='user' path='/user/:id' handler={require('./components/UserProfile')} />
</Route>);

API.startFetchingChirps();
API.startFetchingUsers();
ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Root) {
    React.render(<Root />, document.getElementById('app')); // render(object, location)
});