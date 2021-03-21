const { User, Book } = require('../models');
const { signToken } = require ('../utils/auth');
const { AuthenticationError } = require ('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
          if(context.user) {
            const userData = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
          
          return userData;
          }
    
          throw new AuthenticationError('Not logged in');
        }
      },

      Mutation: {
          login: async (parent, {email, password}) => {
              const user = await User.findOne({email});
              if (!user) {
                  throw new AuthenticationError('Incorrect credentials')
              }

              const correctPw = await user.isCorrectPassword(password)
              if (!correct){
                  throw new AuthenticationError('Incorrect Password')
              }
              const token = signToken(user);
              return {token, user}
          },

          addUser: async (parent, args) => {
              const user = User.create(args);
              const toker = signToken(user);
              return {token, user};
          },

          saveBook: async (parent, {input}, context) => {
              if (context.user) {
                  const uodateUser = await User.findByIdAndUpdate (
                      {_id: context.user._id},
                      {$addToSet: {savedBooks: input}},
                      {new:true}
                  );
                  return updateUser;
              }
              throw new AuthenticationError('You need to be logged in')
          },

          removeBook: async (parent, args, context) => {
              if (context.user) {
                  const updatedUSer = await User.findOneAndUpdate(
                      {_id: context.user._id},
                      {$pull: {savedBooks: {bookId: args.bookId}}},
                      {new: true}
                  );
                  return updatedUSer;
              }
          }
      }
}


module.exports = resolvers;