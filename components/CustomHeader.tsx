// components/CustomHeader.tsx (update or create in components)
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomHeader = ({ title }: { title: string }) => {
  return (
    <LinearGradient colors={['#EFF6FF', '#DBEAFE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="h-16 flex-row items-center justify-between px-4 shadow-md">
      <Text className="text-2xl font-bold text-primary">{title}</Text>
      <TouchableOpacity>
        <Image source={require('../assets/icon.png')} className="w-10 h-10 rounded-full" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomHeader;