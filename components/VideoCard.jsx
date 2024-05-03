import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Video, ResizeMode } from "expo-av";

import { icons } from "../constants";
import { updatePost } from "../lib/appWrite";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({
  video: { title, thumbnail, video, creator, prompt, $id },
}) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();
  const [bookmarked, setBookmarked] = useState(null);

  const addBookmark = async () => {
    if (!title || !prompt || !video || !thumbnail || !creator) {
      Alert.alert("No Posts found!");
    }

    if (!bookmarked) setBookmarked(user.$id);
    else setBookmarked(null);

    try {
      const post = {
        postId: $id,
        title,
        video,
        thumbnail,
        prompt,
        creator,
        bookmarked,
      };

      await updatePost(post);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm text-white font-psemibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-sm text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="pt-2" onPress={addBookmark}>
          <Image
            source={icons.bookmark}
            className="w-5 h-5"
            resizeMode="contain"
            tintColor={bookmarked ? "#FFA001" : "#CDCDE0"}
          />
        </TouchableOpacity>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinished) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
