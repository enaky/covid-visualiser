import React from 'react';
import { StyleSheet, Dimensions } from 'react-native'
import MapView, { Geojson } from 'react-native-maps'
import colors from '../../config/colors'
import { ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const ConnectorService = require('../../services/ConnectorService');
import worldColorService from '../../services/color/MapWorldColorService';

const height = Dimensions.get('window').height;
const geoMaps = require('../../assets/data/parsed.low.geo.json');


class WorldMapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIsReturned: false
        };
        console.log("\n[WorldMapScreen] - Constructor");
    }

    async componentDidMount() {
        console.log("[WorldMapScreen] - componentDidMount");
        try {
            let data;
            let localData = JSON.parse(await AsyncStorage.getItem("WorldMap"));
            let needUpdate = false;
            if (localData === undefined) {
                needUpdate = true;
            } else {
                if (localData["updated"] === undefined || localData["data"] === undefined) {
                    needUpdate = true;
                } else {
                    let seconds = moment().diff(moment(localData["updated"]), 'seconds');
                    console.log("[WorldMapScreen] - Seconds passed since the last update: " + seconds);
                    if (seconds > 3600) { //o ora
                        needUpdate = true;
                    }
                }
            }
            console.log("[WorldMapScreen] - Checked data in AsyncStorage. NeedUpdate? " + needUpdate);
            if (needUpdate) {
                data = await ConnectorService.getCountriesActivePerMillion();
                AsyncStorage.setItem("WorldMap", JSON.stringify({ "data": data, "updated": moment().valueOf() }));

                console.log("\n\t***AsyncStorage: Setting data WorldMap on " + moment().format('MMMM Do YYYY, HH:mm:ss'));
            } else {
                data = localData["data"];
            }
            worldColorService.setData(data);
        } catch (err) {
            throw err;
        }
        console.log("[WorldMapScreen] - Data Loaded");
    }

    render() {
        console.log("[WorldMapScreen] - IN render callback");
        return (
            <View style={!this.state.dataIsReturned ? styles.container : {}}>
                {
                    !this.state.dataIsReturned ?
                        <ActivityIndicator
                            color='#bc2b78'
                            size="large"
                            style={styles.activityIndicator} />
                        : this.renderMap()
                }
            </View>
        );
    }

    renderMap() {
        return <MapView
            provider={null}
            style={styles.map}
            loadingEnabled={true}
            region={{
                latitude: 10.0,
                longitude: 18,
                latitudeDelta: 100,
                longitudeDelta: 100
            }}
            showsBuildings={false}
            showsTraffic={false}
            showsIndoors={false}
            rotateEnabled={false}
        >
            {
                Object.keys(geoMaps).map(key => (
                    <Geojson
                        key={key}
                        geojson={geoMaps[key]} // geojson of the countries you want to highlight
                        fillColor={worldColorService.colorSpectrumByCountryKey(key)}
                    />
                ))
            }
        </MapView >
    }
}

const styles = StyleSheet.create({
    map: {
        height
    },
    container: {
        flex: 1,
        backgroundColor: colors.secondaryBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


export default WorldMapScreen;
