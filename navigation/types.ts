export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  DestinationDetail: { destination: string };
  Home: undefined;
  Destinations: undefined;
};

export type Location={
  latitude:number;
  longitude: number;
}

export type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  location: Location;
  tips?: string;
  wayToReach?: string;
};
