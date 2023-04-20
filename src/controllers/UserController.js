let users = require('../mocks/users')

module.exports = {
    listUsers(req, res){
        const { order } = req.query
        const sortedUsers = users.sort((prevElement, nextElement) => {
            if(order === 'desc'){
                return prevElement.id < nextElement.id ? 1 : -1
            }
            return prevElement.id > nextElement.id ? 1 : -1
        })

        const response = sortedUsers
        res.send(200, response)
    },
    getUserById(req, res){
        let { id } = req.params
        const user = users.find(user => user.id === Number(id))
        const response = user
        
        if(!response){
            const notFoundResponse = {error: `user ${id} not found`}

            return res.send(400, notFoundResponse)
        }
        
        res.send(200, response)
    },
    createUser(req, res){
        const body = req.body 

        const newUser = {
            name: body.name,
            id: users.length + 1
        }

        users.push(newUser)

        const response = {'name': body.name}
        
        res.send(201, response)
        
    },
    deleteUser(req, res){
        let { id } = req.params
        id = Number(id)

        const userToBeDeleted= users.find(usr => usr.id === id)

        if(!userToBeDeleted){
            res.send(400, {message: 'User not found'})
        }

        users = users.filter(usr => usr.id !== id)

        const response = {ok: `user ${id} was deleted`}

        res.send(200, response)
    },
    updateUser(req, res){
        let { id } = req.params
        id = Number(id)

        const body = req.body
        const name = body.name

        const userToBeUpdated = users.find(usr => usr.id === id)

        if(!userToBeUpdated){
            return res.send(400, {message: 'User not found'})
        }

        users = users.map((usr) => {
            if(usr.id === id){
                return {
                    ...usr,
                    name
                }
            }

            return usr
        })

        const response = {ok: `user ${id} was update`}

        res.send(200, response)
    }
}