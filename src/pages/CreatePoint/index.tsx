import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import './CreatePoint.css'
import logo from '../../assets/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api'
import axios from 'axios'
import {LeafletMouseEvent} from "leaflet";

interface Item {
    id: number;
    name: string;
    slug: string;
}

interface IBGEUFsResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [formData, setFormDate] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);
    useEffect(() => {
        axios.get<IBGEUFsResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const UFInitials = response.data.map(uf => uf.sigla)
            setUfs(UFInitials)
        })
    }, []);
    useEffect(() => {
        axios.get<IBGEUFsResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const UFInitials = response.data.map(uf => uf.sigla)
            setUfs(UFInitials)
        })
    }, []);
    useEffect(() => {
        if (selectedUf === '0')
            return;
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCities(cityNames)
        })
    }, [selectedUf]);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude])
        })
    }, []);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng])
    }

    function handleImputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setFormDate({...formData, [name]: value});
    }

    function handleSelectItem(id: number) {
        const alreadySeleted = selectedItems.findIndex(item => item === id);
        if (alreadySeleted > -1) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('users', data);
        alert('Cadastro finalizado com sucesso');
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Adote um Pet"/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para Rome
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do Pet</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome do Responsável</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            onChange={handleImputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="off"
                                onChange={handleImputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                autoComplete="off"
                                onChange={handleImputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione a localidade no mapa abaixo</span>
                    </legend>
                    <Map center={initialPosition} zoom={13} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                onChange={handleSelectUf}
                                value={selectedUf}
                            >
                                <option value="sc">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option value={uf} key={uf}>{uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                onChange={handleSelectCity}
                                value={selectedCity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option value={city} key={city}>{city}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Detalhes do Pet</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <span>{item.name}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>
                <button type="submit">Cadastrar Pet</button>
            </form>
        </div>
    );
}
export default CreatePoint;
