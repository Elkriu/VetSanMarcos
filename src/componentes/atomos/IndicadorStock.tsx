import { STOCK_BAJO } from "../../datos/stock";

interface IndicadorStockProps {
    stock: number;
}

function IndicadorStock({ stock }: IndicadorStockProps) {
    if (stock === 0) {
        return <span className="badge bg-danger">Agotado</span>;
    }
    if (stock <= STOCK_BAJO) {
        return <span className="badge bg-warning text-dark">¡Quedan {stock}!</span>;
    }
    return <span className="badge bg-success">{stock} disponibles</span>;
}

export default IndicadorStock;