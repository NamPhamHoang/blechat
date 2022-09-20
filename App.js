/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import {
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  View,
  Text,
  LogBox,
  StyleSheet
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { BleManager, Device } from 'react-native-ble-plx';

const SERVICE_UUID = '36580ab0-3835-11ed-a261-0242ac120002';

const MESSAGE_UUID = '3e162214-3835-11ed-a261-0242ac120002';
const BOX_UUID = '43a11040-3835-11ed-a261-0242ac120002';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs();
const BLTManager = new BleManager();

const App: () => Node = () => {
  const [isConnected, setIsConnected] = useState(false);
  // const peripherals = new Map();
  const [message, setMessage] = useState('Nothing Yet');
  const [connectedDevice, setConnectedDevice] = useState();

  async function scanDevices() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(answere => {
      console.log('scanning');
      // display the Activityindicator

      BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.warn(error);
        }

        console.log(scannedDevice?.name, scannedDevice?.localName)
       
        if (scannedDevice && scannedDevice.name == 'IPhone của Nam') {
          BLTManager.stopDeviceScan();
          connectDevice(scannedDevice);
        }
      });

      // stop scanning devices after 5 seconds
      // setTimeout(() => {
      //   BLTManager.stopDeviceScan();
      // }, 5000);
    });
  }

  async function connectDevice(device) {
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        console.log("device: ", device)
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });

        //Read inital values

        //Message
        device
          .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
          .then(valenc => {
            setMessage(base64.decode(valenc?.value));
          });

        //BoxValue
        device
          .readCharacteristicForService(SERVICE_UUID, BOX_UUID)
          .then(valenc => {
            setBoxValue(StringToBool(base64.decode(valenc?.value)));
          });

        //monitor values and tell what to do when receiving an update

        //Message
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              console.log(
                'Message update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'messagetransaction',
        );

        //BoxValue
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          BOX_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setBoxValue(StringToBool(base64.decode(characteristic?.value)));
              console.log(
                'Box Value update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'boxtransaction',
        );

        console.log('Connection established');
      });
  }

  // useEffect(() => {
  //   const subscription = BLTManager.onStateChange((state) => {
  //     console.log(state)
  //     if(state === "PoweredOn") {
  //       scanDevices()
  //       subscription.remove();
  //     }
  //   })
  //   return () => subscription.remove()
  // }, []);

  return (
    <View>
      <View style={{paddingBottom: 200}}></View>

      {/* Title */}
      <View style={styles.rowView}>
        <Text style={styles.titleText}>BLE Example</Text>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Connect Button */}
      <View style={styles.rowView}>
        <TouchableOpacity style={{width: 120}}>
          {!isConnected ? (
            <Button
              title="Connect"
              onPress={() => {
                scanDevices();
              }}
              disabled={false}
            />
          ) : (
            <Button
              title="Disonnect"
              onPress={() => {
                disconnectDevice();
              }}
              disabled={false}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={{paddingBottom: 20}}></View>

      {/* Monitored Value */}

      <View style={styles.rowView}>
        <Text style={styles.baseText}>{message}</Text>
      </View>

      <View style={{paddingBottom: 20}}></View>

    </View>
  );
};

export const styles = StyleSheet.create({
  baseText: {
    fontSize: 15,
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowView: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export default App;
