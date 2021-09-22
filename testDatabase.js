//Constants
const users = "users";
const messages = "messeges";

class testDataBase
{
    constructor()
    {
        this.testObj = { users: { "Ray": 0, "Bill": 0 }, messeges: { 0: "First Message" } };
    }

    getAll()
    {
        return this.testObj;
    }
    get(key)
    {
        return this.testObj[key];
    }
    set(key, value)
    {
        this.testObj[key] = value;
    }
    update(value)
    {
        alert("made it this far");
        for (var key in value)
        {
            if (this.testObj[key] !== undefined)
                this.testObj[key] = value[key];
        }
    }

    /* Public Methods */
    pushMessage(mesgText)
    {
        this.testObj.messeges[Object.keys(this.testObj.messeges)] = mesgText;
    }
    getMessages()
    {
        return this.testObj.messeges;
    }
}