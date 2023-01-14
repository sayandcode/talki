type Discriminate<Union, DiscriminatorObj extends Partial<Union>> = Extract<
  Union,
  DiscriminatorObj
>;

export default Discriminate;
