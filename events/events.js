const EventEmitter = require('events');

class Event extends EventEmitter
{
    insert(user)
    {
        this.emit('userinserted',user);
    }
    delete(user)
    {
        this.emit('userdeleted',user);
    }

}
module.exports = Event;

