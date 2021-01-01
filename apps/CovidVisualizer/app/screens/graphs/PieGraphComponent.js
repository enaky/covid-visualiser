import React from "react";
import BoxContainer from "../containers/BoxContainer";
import NumberFormatter from "../../services/NumberFormatterService";
import {
    VictoryPie
} from "victory-native";
import imageStyle from "../../config/styles/imagestyle";
import textStyle from "../../config/styles/textstyles";
import colorStyle from "../../config/colors";
import GraphTitle from "../containers/titles/GraphTitle";
import {Image, Text} from "react-native";

export default class WorldGraphComponent extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.data != null )
        {
            this.deathsPercentage = Math.round(this.props.data["today"]["deaths"] / this.props.data["today"]["cases"] * 1000) / 10;
            this.recoveredPercentage = Math.round(this.props.data["today"]["recovered"] / this.props.data["today"]["cases"] * 1000) / 10;
            this.activePercentage = Math.round(this.props.data["today"]["active"] / this.props.data["today"]["cases"] * 1000) / 10;
        }
    }
    render() {
        return (
            <BoxContainer>
                <GraphTitle
                    text={this.props.data["name"] != null ?
                        `${this.props.data["name"]} Covid-19 stats (${this.props.data["iso2"]}, ${this.props.data["iso3"]}) \n Updated: ${this.props.data["today"]["update"]}` :
                        `Worldwide Covid-19 stats \n Updated: ${this.props.data["today"]["update"]}`}
                />
                {
                    this.props.data["flag"] != null ?
                        <Image
                            style={imageStyle.flags.normal}
                            source={{uri: this.props.data["flag"]}}
                        />
                        : null
                }
                <VictoryPie
                    data={[
                        { x: "Deaths", y: this.deathsPercentage },
                        { x: "Recovered", y: this.recoveredPercentage },
                        { x: "Active", y: this.activePercentage }
                    ]}
                    style={{
                        labels:{
                            padding: -120,
                            fill: "white",
                            fontSize: 15,
                        }
                    }}
                    labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                    labelPlacement={"parallel"}
                    colorScale={[
                        colorStyle.graphColors.deathsColor,
                        colorStyle.graphColors.recoveredColor,
                        colorStyle.graphColors.activeColor
                    ]}
                    padding={{ top: 30, bottom: 50, left: -20, right: 0 }}
                />
                <Text
                    style={textStyle.infoTextStyle}
                >
                    Today{"\n"}
                    Total cases: {NumberFormatter.formatNumber(this.props.data["today"]["cases"]) + "\n"}
                    Active cases: {NumberFormatter.formatNumber(this.props.data["today"]["active"])+ "\n"}
                    Death cases: {NumberFormatter.formatNumber(this.props.data["today"]["deaths"]) + "\n"}
                    Recovered cases: {NumberFormatter.formatNumber(this.props.data["today"]["recovered"]) + "\n"}
                    {"\n\n\n"}Yesterday{"\n"}
                    Total cases: {NumberFormatter.formatNumber(this.props.data["yesterday"]["cases"]) + "\n"}
                    Active cases: {NumberFormatter.formatNumber(this.props.data["yesterday"]["active"])+ "\n"}
                    Death cases: {NumberFormatter.formatNumber(this.props.data["yesterday"]["deaths"]) + "\n"}
                    Recovered cases: {NumberFormatter.formatNumber(this.props.data["yesterday"]["recovered"]) + "\n"}
                    {"\n\n\n"}Two days ago{"\n"}
                    Total cases: {NumberFormatter.formatNumber(this.props.data["twoDaysAgo"]["cases"]) + "\n"}
                    Active cases: {NumberFormatter.formatNumber(this.props.data["twoDaysAgo"]["active"])+ "\n"}
                    Death cases: {NumberFormatter.formatNumber(this.props.data["twoDaysAgo"]["deaths"]) + "\n"}
                    Recovered cases: {NumberFormatter.formatNumber(this.props.data["twoDaysAgo"]["recovered"]) + "\n"}
                </Text>
            </BoxContainer>
        );
    }
}
