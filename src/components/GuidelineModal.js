import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GuidelineModal({ visible, onClose, targetPosition }) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (targetPosition && modalRef.current) {
      const { width, height } = modalRef.current.getBoundingClientRect();
      // Calculate modal position based on target position
      const modalTop = targetPosition.top - height - 10;
      const modalLeft = targetPosition.left + (targetPosition.width - width) / 2;
      setModalPosition({ top: modalTop, left: modalLeft });
    }
  }, [targetPosition]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <View
          ref={modalRef}
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 9999,
          }}
        >
          <Text>This is the guideline content.</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
