import React, { Component } from "react";
import { PieChart } from "react-minimal-pie-chart";
import config from "../utils/config";

import Loader from "../components/Loader";

import election from "../assets/election-in-process.jpg";

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: undefined,
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    fetch(`${config.serverUrl}/api/register/getresults`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const { body } = data;
        const { response } = body;
        const { rojo, amarillo, azul, blanco, nulo } = response;
        if (
          rojo === 0 &&
          amarillo === 0 &&
          azul === 0 &&
          blanco === 0 &&
          nulo === 0
        ) {
          this.setState({
            error: true,
            data: undefined,
            loading: false,
          });
        } else {
          this.setState({
            error: null,
            data: {
              rojo,
              amarillo,
              azul,
              blanco,
              nulo,
            },
            loading: false,
          });
        }
      });
  };

  render() {
    if (this.state.error) {
      return (
        <div>
          <div className="row">
            <div className="col mt-4 mb-4">
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-8 offset-2 mt-4 text-center">
              <h1 className="mb-5">LA ELECCIÓN NO HA FINALIZADO</h1>
              <img src={election} height="450px" alt="Random election" />
            </div>
          </div>
        </div>
      );
    }

    if (this.state.loading) {
      return <Loader></Loader>;
    }
    const { amarillo, azul, rojo, blanco, nulo } = this.state.data;
    return (
      <div>
        <div className="row">
          <div className="col mt-4">
            <br />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-5 offset-2 mt-5">
            <h2 className="">RESULTADOS</h2>
            <br />
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Opción</th>
                  <th scope="col">Votos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Amarillo</td>
                  <td>{amarillo}</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Azul</td>
                  <td>{azul}</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Rojo</td>
                  <td>{rojo}</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Nulo</td>
                  <td>{nulo}</td>
                </tr>
                <tr>
                  <th scope="row">5</th>
                  <td>Blanco</td>
                  <td>{blanco}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-3">
            <PieChart
              animation
              animationDuration={500}
              animationEasing="ease-out"
              center={[50, 50]}
              data={[
                { title: "Rojo", value: rojo, color: "#ff0000" },
                { title: "Amarillo", value: amarillo, color: "#ffff00" },
                { title: "Azul", value: azul, color: "#0000ff" },
                { title: "Blanco", value: blanco, color: "#a9a9a9" },
                { title: "Nulo", value: nulo, color: "#444444" },
              ]}
              labelPosition={50}
              lineWidth={70}
              paddingAngle={0}
              radius={30}
              startAngle={0}
              viewBoxSize={[100, 100]}
            />
          </div>
        </div>
      </div>
    );
  }
}
