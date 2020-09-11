import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';
const router = Router();

router.get('/heroes',(req: Request, res: Response)=>{
    const query = `
        Select *
            from heroes`;
    MySQL.ejecutarQuery(query, (err:any, heroes: Object[]) => {
        if ( err ) {
            res.status(400).json({
                    ok:false,
                    error:err
                });
            }else{
                res.json({
                    ok: true,
                    heroes: heroes
                });
            }
    });

});
router.get('/heroes/:id',(req: Request, res: Response)=>{

    const id = req.params.id;
    const escapeId = MySQL.instance.cnn.escape(id);

    const query = `
        Select *
            from heroes
        Where id=${escapeId}`;
    MySQL.ejecutarQuery(query, (err:any, heroes: Object[]) => {
        if ( err ) {
            res.status(400).json({
                    ok:false,
                    error:err
                });
            }else{
                res.json({
                    ok: true,
                    heroe: heroes[0]
                });
            }
    });
});
export default router;