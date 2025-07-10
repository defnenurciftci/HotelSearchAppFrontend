import React from 'react'

const Cards = ({ name, location, price, image, rating }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img src={image} alt={name} className="h-48 w-full object-cover" />
        <div className="p-4">
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-gray-500">{location}</p>
            <div className="flex items-center justify-between mt-2">
                <span className="text-green-600 font-bold">${price} / gece</span>
                <span className="text-yellow-500">⭐ {rating}</span>
            </div>
        </div>
    </div>
)

export default Cards