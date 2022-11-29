// import {

// export default router({
//   aggregateUser: procedure
//     .input(UserAggregateSchema)
//     .query(async ({ input, ctx }) => {
//       const aggregateUser = await ctx.prisma.user.aggregate(input);
//       return aggregateUser;
//     }),
//   createUser: procedure
//     .input(UserCreateOneSchema)
//     .query(async ({ input, ctx }) => {
//       const createOneUser = await ctx.prisma.user.create(input);
//       return createOneUser;
//     }),
//   createManyUsers: procedure
//     .input(UserCreateManySchema)
//     .query(async ({ input, ctx }) => {
//       const createManyUser = await ctx.prisma.user.createMany(input);
//       return createManyUser;
//     }),

//   findFirstUser: procedure
//     .input(UserFindFirstSchema)
//     .query(async ({ input, ctx }) => {
//       const findFirstUser = await ctx.prisma.user.findFirst(input);
//       return findFirstUser;
//     }),
// });
