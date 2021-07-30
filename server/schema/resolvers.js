const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        users: async () => {
            return User.find()
        },
        me: async (parent, args, context) => {
            if(context.user){
            const user = await User.findOne({ _id: context.user._id})
            return user
            }
            
            throw new AuthenticationError('You need to log in!')
        }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email })

            if(!user){
                throw new AuthenticationError('Wrong email or password!')
            }

            const validPassword = await user.isCorrectPassword(password)
            if(!validPassword){
                throw new AuthenticationError('Wrong email or password!')
            }

            const token = signToken(user)
            return { user, token }
        },
        addUser: async(parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            return { user, token }
        },
        saveBook: async (parent, { bookId, authors, description, title, image, link }, context ) => {
            if(context.user){
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: { bookId, authors, description, title, image, link } } },
                    { new: true }
                    )
                return updateUser
            }
            throw new  AuthenticationError('Cannot do that til you log in!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                    )
                return updateUser
            }
            throw new AuthenticationError('Cannot do that til you log in!')
        }
    }
}


module.exports = resolvers;