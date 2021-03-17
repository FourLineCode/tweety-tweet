import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateOrConnectWithoutLikeInput } from "../inputs/UserCreateOrConnectWithoutLikeInput";
import { UserCreateWithoutLikeInput } from "../inputs/UserCreateWithoutLikeInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class UserCreateNestedOneWithoutLikeInput {
  @TypeGraphQL.Field(_type => UserCreateWithoutLikeInput, {
    nullable: true
  })
  create?: UserCreateWithoutLikeInput | undefined;

  @TypeGraphQL.Field(_type => UserCreateOrConnectWithoutLikeInput, {
    nullable: true
  })
  connectOrCreate?: UserCreateOrConnectWithoutLikeInput | undefined;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, {
    nullable: true
  })
  connect?: UserWhereUniqueInput | undefined;
}