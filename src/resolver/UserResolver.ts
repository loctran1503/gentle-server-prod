import { dataSource } from "../data-source";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Admin } from "../entites/Admin";
import { User } from "../entites/User";
import { checkAuth } from "../middleware/checkAuth";
import { getUserId } from "../middleware/getUserId";
import { AuthInput } from "../types/input/AuthInput";
import { BillStatusType } from "../types/others/BillStatusType";
import { Context } from "../types/others/Context";

import { PaginationUsersResponse } from "../types/response/PaginationUsersResponse";
import { SimpleResponse } from "../types/response/SimpleResponse";
import { UserResponse } from "../types/response/UserResponse";
import { createToken } from "../utils/auth";
import { USER_LIMIT } from "../utils/constants";
import { IntroducePriceCaculater } from "../utils/IntroducePriceCaculater";
import { randomIntroduceCode } from "../utils/randomCode";

@Resolver((_of) => User)
export class UserResolver {
  @FieldResolver((_return) => Number)
  confirmWaitingCount(@Root() root: User) {
    return root.bills?.filter(
      (item) => item.billStatus === BillStatusType.COMFIRM_WAITING
    ).length;
  }
  @FieldResolver((_return) => Number)
  packedCount(@Root() root: User) {
    return root.bills?.filter(
      (item) => item.billStatus === BillStatusType.PACKED
    ).length;
  }
  @FieldResolver((_return) => Number)
  deliveringCount(@Root() root: User) {
    return root.bills?.filter(
      (item) => item.billStatus === BillStatusType.DELIVERING
    ).length;
  }
  @FieldResolver((_return) => Number)
  cancelCount(@Root() root: User) {
    return root.bills?.filter(
      (item) => item.billStatus === BillStatusType.CANCEL
    ).length;
  }

  //getUser
  @Query((_return) => UserResponse)
  @UseMiddleware(checkAuth)
  async getUser(@Ctx() context: Context): Promise<UserResponse> {
    try {
      const userExitsting = await User.findOne({
        where: {
          id: context.user.userId,
        },
        relations: [
          "bills",
          "bills.billProducts",
          "bills.customer",
          "moneyBonuses",
        ],
      });
      if (userExitsting) {
        return {
          code: 200,
          success: true,
          user: userExitsting,
        };
      } else {
        return {
          success: false,
          code: 400,
          message: "User not found",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  //Login
  @Mutation((_return) => UserResponse)
  async loginWithsocial(
    @Arg("authInput") authInput: AuthInput
    // @Ctx() { res }: Context
  ): Promise<UserResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const userId = authInput.userId;

        const admin = await transactionManager.findOne(Admin, {
          where: {
            adminId: userId,
          },
        });
        if (admin) {
          admin.adminName = authInput.userName!
          admin.avatar = authInput.userAvartar!
        await transactionManager.save(admin)
          // sendRefreshToken(res, admin.id.toString());
          return {
            code: 200,
            success: true,
            message: "Admin Login successfully!",
            token: createToken("accessToken", admin.id.toString()),
          };
        } else {
          //not is admin
          const user = await transactionManager.findOne(User, {
            where: {
              userId,
            },
          });
          if (user) {
            (user.userAvatar = authInput.userAvartar!),
              (user.userName = authInput.userName!);
            await transactionManager.save(user);
            // sendRefreshToken(res, user.id.toString());

            return {
              code: 200,
              success: true,
              message: "Login successfully!",
              user,
              token: createToken("accessToken", user.id.toString()),
            };
          } else {
            let isStop = true;
            while (isStop) {
              const introduceCode = randomIntroduceCode(100000, 999999);
              const existingUser = await transactionManager.findOne(User, {
                where: {
                  introduceCode,
                },
              });
              if (!existingUser) {
                const newUser = transactionManager.create(User, {
                  userId: authInput.userId,
                  userAvatar: authInput.userAvartar,
                  userName: authInput.userName,
                  introduceCode: randomIntroduceCode(100000, 999999),
                });
                await transactionManager.save(newUser);
                // sendRefreshToken(res, newUser.id.toString());
                isStop = false;
                return {
                  code: 200,
                  success: true,
                  message: "Register successfully!",
                  user: newUser,
                  token: createToken("accessToken", newUser.id.toString()),
                };
              }
            }
          }
        }
        return {
          code: 400,
          success: false,
          message: "Something wrong",
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    });
  }
  //Logout
  @Mutation((_return) => UserResponse)
  async logout(@Ctx() { res }: Context): Promise<UserResponse> {
    try {
      res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME!, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/refresh_token",
      });
      return {
        code: 200,
        success: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        code: 500,
        success: false,
      };
    }
  }
  //Check Introduce Code
  @Query((_return) => UserResponse)
  @UseMiddleware(getUserId)
  async checkIntroduceCode(
    @Arg("introduceCode") introduceCode: number,
    @Arg("totalPrice") totalPrice: number,
    @Ctx() { user }: Context
  ): Promise<UserResponse> {
    try {
      const userExisting = await User.findOne({
        where: {
          introduceCode,
        },
      });

      if (userExisting) {
        return {
          success: true,
          code: 200,
          message: "Áp dụng mã thành công",
          introducePrice: IntroducePriceCaculater(totalPrice),
        };
      }
      if (!userExisting) {
        return {
          success: false,
          code: 400,
          message: "Mã giảm giá không hợp lệ",
        };
      }
      if (user.userId)
        return {
          success: false,
          code: 400,
          message: "Không thể nhập mã cho chính bạn",
          introducePrice: IntroducePriceCaculater(totalPrice),
        };

      return {
        code: 500,
        success: false,
        message: "Unknown Error",
      };
    } catch (error) {
      return {
        message: error.message,
        code: 500,
        success: false,
      };
    }
  }
  //user pagination
  @Query((_return) => PaginationUsersResponse)
  async getPaginationUsers(
    @Arg("skip", { nullable: true }) skip?: number
  ): Promise<PaginationUsersResponse> {
    if (!skip) skip = 0;

    try {
      const users = await User.find({
        where: {
          bills: !null,
          isHidden: false,
        },
        relations: ["bills"],
        order: {
          createdAt: "DESC",
        },
        take: USER_LIMIT,
        skip,
      });
      const totalCount = await User.count({
        where: {
          bills: !null,
          isHidden: false,
        },
        relations: ["bills"],
      });

      const cursor = skip + USER_LIMIT;
      let hasMore: boolean = false;
      switch (true) {
        case totalCount < USER_LIMIT:
          hasMore = false;
          break;
        case cursor >= totalCount:
          hasMore = false;
          break;

        default:
          hasMore = true;
          break;
      }

      if (users)
        return {
          code: 200,
          success: true,
          users,
          totalCount,
          cursor,
          hasMore,
        };
      else
        return {
          code: 400,
          success: false,
          message: "Users not found",
        };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Server error:${error.message}`,
      };
    }
  }
  //Change is hidden
  @Mutation((_return) => SimpleResponse)
  @UseMiddleware(getUserId)
  async changeIsHidden(
    @Arg("value") value: boolean,
    @Ctx() { user }: Context
  ): Promise<SimpleResponse> {
    return await dataSource.transaction(async (transactionManager) => {
      try {
        const userExisting = await transactionManager.findOne(User, {
          where: {
            id: user.userId,
          },
        });
        if (!userExisting)
          return {
            code: 400,
            success: false,
            message: "User not found",
          };
        userExisting.isHidden = value;
        await transactionManager.save(userExisting);
        return {
          code: 200,
          success: true,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Server error:${error.message}`,
        };
      }
    });
  }
  // @Query()
}
